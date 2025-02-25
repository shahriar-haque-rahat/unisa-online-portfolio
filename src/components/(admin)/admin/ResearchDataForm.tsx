"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import JsonEditor from "./tools/JsonEditor";
import { toast } from "react-hot-toast";

const ResearchDataForm = () => {
  const [researchEntries, setResearchEntries] = useState([]);
  const [formData, setFormData] = useState({
    imageSrc: "",
    title: "",
    description: "",
    publicationName: "",
    publicationDate: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const data = await JsonEditor.getAll("researchData");
      setResearchEntries(data || []);
    } catch (error) {
      console.error("Error fetching research data:", error);
      toast.error("Failed to fetch research data.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await JsonEditor.edit("researchData", editingId, formData);
        toast.success("Research updated successfully!");
        setEditingId(null);
      } else {
        await JsonEditor.add("researchData", formData);
        toast.success("Research added successfully!");
      }
      setFormData({
        imageSrc: "",
        title: "",
        description: "",
        publicationName: "",
        publicationDate: "",
      });
      fetchData();
    } catch (error) {
      console.error("Error saving research data:", error);
      toast.error("Failed to save research data.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this research entry?")) return;
    try {
      await JsonEditor.delete("researchData", id);
      toast.success("Research entry deleted successfully!");
      fetchData();
    } catch (error) {
      console.error("Error deleting research data:", error);
      toast.error("Failed to delete research entry.");
    }
  };

  return (
    <motion.div
      className="bg-white shadow-lg rounded-lg p-6 my-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Research Data</h2>
      <p className="text-gray-500 mb-6">Manage your research entries here.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
        <input
          type="text"
          placeholder="Publication Name"
          value={formData.publicationName}
          onChange={(e) => setFormData({ ...formData, publicationName: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
        <input
          type="text"
          placeholder="Publication Date (e.g., January 15, 2023)"
          value={formData.publicationDate}
          onChange={(e) => setFormData({ ...formData, publicationDate: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
        <input
          type="text"
          placeholder="Image URL (optional)"
          value={formData.imageSrc}
          onChange={(e) => setFormData({ ...formData, imageSrc: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {editingId ? "Update Research" : "Add Research"}
        </button>
      </form>

      <table className="w-full mt-6 border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="border p-2 text-gray-600">Title</th>
            <th className="border p-2 text-gray-600">Publication Name</th>
            <th className="border p-2 text-gray-600">Publication Date</th>
            <th className="border p-2 text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {researchEntries.map((item) => (
            <tr key={item.id} className="text-center">
              <td className="border p-2">{item.title}</td>
              <td className="border p-2">{item.publicationName}</td>
              <td className="border p-2">{item.publicationDate}</td>
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
          {researchEntries.length === 0 && (
            <tr>
              <td colSpan={4} className="p-4 text-gray-500">
                No research entries added.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </motion.div>
  );
};

export default ResearchDataForm;
