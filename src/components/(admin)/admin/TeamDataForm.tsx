"use client";
import React, { useState, useEffect, createRef, useRef } from "react";
import JsonEditor from "./tools/JsonEditor";
import ImageUploader from "./tools/ImageUploader";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { MdDeleteForever, MdEditSquare } from "react-icons/md";

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Refs for each member's ImageUploader.
  const uploaderRefs = useRef<Array<React.RefObject<{ uploadImage: () => Promise<string | null> }>>>([]);

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

  // Restrict field to keys of TeamMember.
  const handleMemberChange = (index: number, field: keyof TeamMember, value: any) => {
    const newMembers = [...formData.members];
    newMembers[index][field] = value;
    setFormData({ ...formData, members: newMembers });
  };

  const addMemberField = () => {
    setFormData({
      ...formData,
      members: [...formData.members, { name: "", university: "", role: "", image: null }],
    });
  };

  const removeMemberField = (index: number) => {
    const newMembers = formData.members.filter((_, i) => i !== index);
    setFormData({ ...formData, members: newMembers });
    uploaderRefs.current.splice(index, 1);
  };

  // For each member, call its uploader (if available) to get the URL before submission.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedMembers = await Promise.all(
        formData.members.map(async (member, index) => {
          let imageUrl = typeof member.image === "string" ? member.image : null;
          const uploaderRef = uploaderRefs.current[index];
          if (uploaderRef && uploaderRef.current) {
            try {
              const newUrl = await uploaderRef.current.uploadImage();
              if (newUrl) {
                imageUrl = newUrl;
                console.log(`Uploader for member ${index} returned new URL:`, newUrl);
              } else {
                console.log(`Uploader for member ${index} did not return a new URL; using existing:`, imageUrl);
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
    // Initialize uploaderRefs for each member in the item.
    uploaderRefs.current = item.members.map(() => createRef());
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team category?")) return;
    try {
      await JsonEditor.delete("teamData", id);
      toast.success("Team category deleted successfully!");
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
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Team Data</h2>
      <p className="text-gray-500 mb-6">
        Manage your team categories and members here (including their images).
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-medium text-gray-700 mb-1">Category</label>
          <input
            type="text"
            placeholder="e.g., Primary Investigator, PhD Students"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2"
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
                  onChange={(e) => handleMemberChange(index, "name", e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
                  required
                />

                <label className="block font-medium text-gray-700 mb-1">University</label>
                <input
                  type="text"
                  placeholder="Member University"
                  value={member.university}
                  onChange={(e) => handleMemberChange(index, "university", e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
                  required
                />

                <label className="block font-medium text-gray-700 mb-1">Role</label>
                <input
                  type="text"
                  placeholder="e.g., PhD Student"
                  value={member.role}
                  onChange={(e) => handleMemberChange(index, "role", e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
                  required
                />

                <label className="block font-medium text-gray-700 mb-1">Image</label>
                <ImageUploader
                  ref={uploaderRefs.current[index]}
                  onUpload={(url) => handleMemberChange(index, "image", url)}
                />
                {member.image && typeof member.image === "string" && (
                  <img src={member.image} alt="Member" className="w-16 h-16 mt-3 object-cover rounded border" />
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

      <table className="w-full mt-6 border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="border p-2 text-gray-600">Category</th>
            <th className="border p-2 text-gray-600">Members</th>
            <th className="border p-2 text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {teamData.map((item: any, idx: number) => (
            <tr key={item.id || idx} className="text-center">
              <td className="border p-2">{item.category}</td>
              <td className="border p-2">
                {item.members?.map((m: any, i: number) => (
                  <div key={i} className="my-1">
                    <strong>{m.name}</strong> - {m.role}
                  </div>
                ))}
              </td>
              <td className="border p-2 space-x-2 w-28">
                <button
                  onClick={() => handleEdit(item)}
                  className="px-2 py-1 text-primary rounded hover:text-secondary"
                >
                  <MdEditSquare size={22} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-2 py-1 text-cancelPrimary rounded hover:text-cancelSecondary"
                >
                  <MdDeleteForever size={24} />
                </button>
              </td>
            </tr>
          ))}
          {teamData.length === 0 && (
            <tr>
              <td colSpan={3} className="p-4 text-gray-500">
                No team data added.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </motion.div>
  );
};

export default TeamDataForm;
