"use client";
import React, { useState, useEffect, createRef, useRef } from "react";
import JsonEditor from "../admin/tools/JsonEditor";
import ImageUploaderEdgestore from "../admin/tools/ImageUploaderEdgestore";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { MdDeleteForever, MdEditSquare } from "react-icons/md";
import { useEdgeStore } from "@/edgestore/edgestore";

// Define a type for a team member.
type TeamMember = {
  name: string;
  university: string;
  role: string;
  image: string | File | null;
};

// Define a type for the team form data.
type TeamFormData = {
  category: string;
  members: TeamMember[];
};

const TeamDataForm = () => {
  const [teamData, setTeamData] = useState<any[]>([]);
  const [formData, setFormData] = useState<TeamFormData>({
    category: "",
    members: [{ name: "", university: "", role: "", image: null }],
  });
  // Store the original team members when editing for deletion comparison.
  const [originalMembers, setOriginalMembers] = useState<TeamMember[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Refs for each member's ImageUploader.
  const uploaderRefs = useRef<
    Array<React.RefObject<{ uploadImage: () => Promise<string | null> }>>
  >([]);

  // Get the Edgestore client.
  const { edgestore } = useEdgeStore();

  const fetchData = async () => {
    try {
      const data = await JsonEditor.getAll("teamData");
      setTeamData(data || []);
    } catch (error) {
      console.error("Error fetching team data:", error);
      toast.error("Failed to fetch team data.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update a member field in the form.
  const handleMemberChange = (
    index: number,
    field: keyof TeamMember,
    value: any
  ) => {
    const newMembers = [...formData.members];
    newMembers[index][field] = value;
    setFormData({ ...formData, members: newMembers });
  };

  const addMemberField = () => {
    setFormData({
      ...formData,
      members: [
        ...formData.members,
        { name: "", university: "", role: "", image: null },
      ],
    });
    // Add a new ref for the new member uploader.
    uploaderRefs.current.push(createRef());
  };

  const removeMemberField = async (index: number) => {
    // If the member has an image (and it's a string), attempt to delete it from Edgestore.
    const memberToRemove = formData.members[index];
    if (memberToRemove.image && typeof memberToRemove.image === "string") {
      try {
        await edgestore.publicFiles.delete({ url: memberToRemove.image });
        toast.success(`Deleted image for member ${index + 1}`);
      } catch (error) {
        console.error(`Failed to delete image for member ${index + 1}:`, error);
        toast.error(`Failed to delete image for member ${index + 1}`);
      }
    }
    const newMembers = formData.members.filter((_, i) => i !== index);
    setFormData({ ...formData, members: newMembers });
    uploaderRefs.current.splice(index, 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // For each member, call its uploader (if available) to update the image.
      const updatedMembers = await Promise.all(
        formData.members.map(async (member, index) => {
          let imageUrl =
            typeof member.image === "string" ? member.image : null;
          const uploaderRef = uploaderRefs.current[index];
          if (uploaderRef && uploaderRef.current) {
            try {
              const newUrl = await uploaderRef.current.uploadImage();
              if (newUrl) {
                imageUrl = newUrl;
                console.log(`Uploader for member ${index} returned:`, newUrl);
              } else {
                console.log(
                  `Uploader for member ${index} did not return a new URL; using existing:`,
                  imageUrl
                );
              }
            } catch (err) {
              toast.error(`Image upload failed for member ${index + 1}`);
            }
          }
          return { ...member, image: imageUrl };
        })
      );

      const dataToSubmit: TeamFormData = { ...formData, members: updatedMembers };

      if (editingId) {
        await JsonEditor.edit("teamData", editingId, dataToSubmit);
        toast.success("Team data updated successfully!");
        // After editing, check each original member.
        await Promise.all(
          originalMembers.map(async (orig, index) => {
            // If a member still exists at this index and its image has changed, delete the old image.
            if (
              orig.image &&
              typeof orig.image === "string" &&
              updatedMembers[index] &&
              updatedMembers[index].image !== orig.image
            ) {
              try {
                await edgestore.publicFiles.delete({ url: orig.image });
                console.log(`Deleted old image for member ${index + 1}:`, orig.image);
              } catch (err) {
                console.error(`Failed to delete old image for member ${index + 1}:`, err);
              }
            }
          })
        );
        setEditingId(null);
      } else {
        await JsonEditor.add("teamData", dataToSubmit);
        toast.success("Team data added successfully!");
      }
      setFormData({
        category: "",
        members: [{ name: "", university: "", role: "", image: null }],
      });
      uploaderRefs.current = [];
      fetchData();
    } catch (error) {
      console.error("Error saving team data:", error);
      toast.error("Failed to save team data.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setFormData(item);
    setEditingId(item.id);
    // Store original members for later comparison.
    setOriginalMembers(item.members || []);
    // Initialize uploaderRefs for each member.
    uploaderRefs.current = item.members.map(() => createRef());
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team category?")) return;
    try {
      // Find the team category to delete (to retrieve its member images)
      const teamToDelete = teamData.find((item) => item.id === id);
      await JsonEditor.delete("teamData", id);
      toast.success("Team category deleted successfully!");
      // Group deletion: delete all images associated with this team category.
      if (teamToDelete?.members && Array.isArray(teamToDelete.members)) {
        await Promise.all(
          teamToDelete.members.map(async (member: TeamMember, i: number) => {
            if (member.image && typeof member.image === "string") {
              try {
                await edgestore.publicFiles.delete({ url: member.image });
                console.log(`Deleted image for member ${i + 1}:`, member.image);
              } catch (error) {
                console.error(`Failed to delete image for member ${i + 1}:`, error);
              }
            }
          })
        );
      }
      fetchData();
    } catch (error) {
      console.error("Error deleting team data:", error);
      toast.error("Failed to delete team category.");
    }
  };

  return (
    <motion.div
      className="bg-white shadow-lg rounded-lg p-6 my-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-medium text-gray-700 mb-1">Category</label>
          <input
            type="text"
            placeholder="e.g., Primary Investigator, PhD Students"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="modern-input"
            required
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Members</h3>
          {formData.members.map((member, index) => {
            if (!uploaderRefs.current[index]) {
              uploaderRefs.current[index] = createRef();
            }
            return (
              <div key={index} className="border p-4 rounded-lg mb-3">
                <label className="block font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  placeholder="Member Name"
                  value={member.name}
                  onChange={(e) =>
                    handleMemberChange(index, "name", e.target.value)
                  }
                  className="modern-input mb-3"
                  required
                />

                <label className="block font-medium text-gray-700 mb-1">
                  University
                </label>
                <input
                  type="text"
                  placeholder="Member University"
                  value={member.university}
                  onChange={(e) =>
                    handleMemberChange(index, "university", e.target.value)
                  }
                  className="modern-input mb-3"
                  required
                />

                <label className="block font-medium text-gray-700 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  placeholder="e.g., PhD Student"
                  value={member.role}
                  onChange={(e) =>
                    handleMemberChange(index, "role", e.target.value)
                  }
                  className="modern-input mb-3"
                  required
                />

                <label className="block font-medium text-gray-700 mb-1">
                  Image
                </label>
                <ImageUploaderEdgestore
                  ref={uploaderRefs.current[index]}
                  onUpload={(url) =>
                    handleMemberChange(index, "image", url)
                  }
                />
                {member.image && typeof member.image === "string" && (
                  <img
                    src={member.image}
                    alt="Member"
                    className="w-16 h-16 mt-3 object-cover rounded border"
                  />
                )}

                <button
                  type="button"
                  onClick={() => removeMemberField(index)}
                  className="mt-4 px-3 py-1 bg-cancelPrimary text-white rounded hover:bg-cancelSecondary transition"
                >
                  Remove Member
                </button>
              </div>
            );
          })}

          <button
            type="button"
            onClick={addMemberField}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Add Member
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-secondary text-white rounded hover:bg-blue-700 transition"
        >
          {editingId ? "Update Team Data" : "Add Team Data"}
        </button>
      </form>

      {/* Responsive Table Container */}
      <div className="modern-table-container mt-6">
        <table className="modern-table">
          <thead>
            <tr className="modern-table-tr">
              <th className="min-w-32 modern-table-th">Image</th>
              <th className="min-w-32 modern-table-th">Category</th>
              <th className="min-w-56 modern-table-th">Members</th>
              <th className="min-w-28 modern-table-th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teamData.map((item: any, idx: number) => (
              <tr key={item.id || idx} className="text-center">
                <td className="modern-table-td">
                  {item.members?.map((m: any, i: number) => (
                    <div key={i} className="my-1">
                      {m.image ? (
                        <img
                          src={m.image}
                          alt={m.name}
                          className="w-16 h-16 object-cover rounded border inline-block"
                        />
                      ) : (
                        "No Image"
                      )}
                    </div>
                  ))}
                </td>
                <td className="modern-table-td">{item.category}</td>
                <td className="modern-table-td">
                  {item.members?.map((m: any, i: number) => (
                    <div key={i} className="my-1">
                      <strong>{m.name}</strong> - {m.role}
                    </div>
                  ))}
                </td>
                <td className="modern-table-td">
                  <button
                    onClick={() => handleEdit(item)}
                    className="modern-edit-btn"
                  >
                    <MdEditSquare size={22} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="modern-delete-btn"
                  >
                    <MdDeleteForever size={24} />
                  </button>
                </td>
              </tr>
            ))}
            {teamData.length === 0 && (
              <tr>
                <td colSpan={4} className="modern-table-td text-center">
                  No team data added.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default TeamDataForm;
