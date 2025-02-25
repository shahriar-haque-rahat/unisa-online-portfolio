"use client";

import { useState, useEffect } from "react";
import JsonEditor from "./tools/JsonEditor";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-hot-toast";

const TeamDataForm = () => {
  const [teamData, setTeamData] = useState([]);
  const [formData, setFormData] = useState({
    category: "",
    members: [{ name: "", university: "", role: "", image: null }],
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Helper function to upload a file
  const uploadFile = async (file) => {
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    try {
      const res = await axios.post("/api/upload", formDataUpload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.imageUrl;
    } catch (error) {
      console.error("File upload error:", error);
      toast.error("Failed to upload image.");
      return null;
    }
  };

  // Fetch existing team data
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

  // Handle changes for each member
  const handleMemberChange = (index, field, value) => {
    const newMembers = [...formData.members];
    newMembers[index][field] = value;
    setFormData({ ...formData, members: newMembers });
  };

  // Add a new blank member
  const addMemberField = () => {
    setFormData({
      ...formData,
      members: [...formData.members, { name: "", university: "", role: "", image: null }],
    });
  };

  // Remove a specific member by index
  const removeMemberField = (index) => {
    const newMembers = formData.members.filter((_, i) => i !== index);
    setFormData({ ...formData, members: newMembers });
  };

  // Submit entire form
  //  - Upload each member's image if it's a File
  //  - Then save data via JsonEditor
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // For each member, if image is a File, upload it
      const updatedMembers = await Promise.all(
        formData.members.map(async (member) => {
          if (member.image && member.image instanceof File) {
            const uploadedUrl = await uploadFile(member.image);
            return { ...member, image: uploadedUrl };
          }
          return member;
        })
      );

      const dataToSubmit = { ...formData, members: updatedMembers };

      if (editingId) {
        // Edit existing entry
        await JsonEditor.edit("teamData", editingId, dataToSubmit);
        toast.success("Team data updated successfully!");
        setEditingId(null);
      } else {
        // Add new entry
        await JsonEditor.add("teamData", dataToSubmit);
        toast.success("Team data added successfully!");
      }

      // Reset form
      setFormData({
        category: "",
        members: [{ name: "", university: "", role: "", image: null }],
      });
      fetchData();
    } catch (error) {
      console.error("Error saving team data:", error);
      toast.error("Failed to save team data.");
    } finally {
      setLoading(false);
    }
  };

  // Load existing entry into form for editing
  const handleEdit = (item) => {
    setFormData(item);
    setEditingId(item.id);
  };

  // Delete entire team category
  const handleDelete = async (id) => {
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
          {formData.members.map((member, index) => (
            <div key={index} className="border p-4 rounded-lg mb-3">
              {/* Name */}
              <label className="block font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                placeholder="Member Name"
                value={member.name}
                onChange={(e) => handleMemberChange(index, "name", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
                required
              />

              {/* University */}
              <label className="block font-medium text-gray-700 mb-1">University</label>
              <input
                type="text"
                placeholder="Member University"
                value={member.university}
                onChange={(e) => handleMemberChange(index, "university", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
                required
              />

              {/* Role */}
              <label className="block font-medium text-gray-700 mb-1">Role</label>
              <input
                type="text"
                placeholder="e.g., PhD Student"
                value={member.role}
                onChange={(e) => handleMemberChange(index, "role", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
                required
              />

              {/* Image (File input) */}
              <label className="block font-medium text-gray-700 mb-1">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleMemberChange(index, "image", e.target.files[0]);
                  }
                }}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              {/* Preview existing or newly uploaded image */}
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
                className="mt-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Remove Member
              </button>
            </div>
          ))}

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
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
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
          {teamData.map((item, idx) => (
            <tr key={item.id || idx} className="text-center">
              <td className="border p-2">{item.category}</td>
              <td className="border p-2">
                {item.members?.map((m, i) => (
                  <div key={i} className="my-1">
                    <strong>{m.name}</strong> - {m.role}
                  </div>
                ))}
              </td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
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
