"use client";
import React, { useState, useEffect } from "react";
import JsonEditor from "./tools/JsonEditor";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { MdDeleteForever, MdEditSquare } from "react-icons/md";

const SocialLinksForm = () => {
  const [socialLinks, setSocialLinks] = useState([]);
  const [formData, setFormData] = useState({ name: "", path: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const data = await JsonEditor.getAll("socialLinks");
      setSocialLinks(data || []);
    } catch (error) {
      console.error("Error fetching social links:", error);
      toast.error("Failed to fetch social links.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await JsonEditor.edit("socialLinks", editingId, formData);
        toast.success("Social link updated successfully!");
        setEditingId(null);
      } else {
        await JsonEditor.add("socialLinks", formData);
        toast.success("Social link added successfully!");
      }
      setFormData({ name: "", path: "" });
      fetchData();
    } catch (error) {
      console.error("Error saving social link:", error);
      toast.error("Failed to save social link.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setFormData({ name: item.name, path: item.path });
    setEditingId(item.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this social link?")) return;
    try {
      await JsonEditor.delete("socialLinks", id);
      toast.success("Social link deleted successfully!");
      fetchData();
    } catch (error) {
      console.error("Error deleting social link:", error);
      toast.error("Failed to delete social link.");
    }
  };

  return (
    <motion.div
      className="bg-white shadow-lg rounded-lg p-6 my-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Social Links</h2>
      <p className="text-gray-500 mb-6">Manage your social media or external links here.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <section className=" grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
          <input
            type="text"
            placeholder="Path (URL)"
            value={formData.path}
            onChange={(e) => setFormData({ ...formData, path: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </section>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-secondary text-white rounded hover:bg-blue-700 transition"
        >
          {editingId ? "Update Social Link" : "Add Social Link"}
        </button>
      </form>

      <table className="w-full mt-6 border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="border p-2 text-gray-600">Name</th>
            <th className="border p-2 text-gray-600">Path</th>
            <th className="border p-2 text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {socialLinks.map((item: any) => (
            <tr key={item.id} className="text-center">
              <td className="border p-2">{item.name}</td>
              <td className="border p-2">{item.path}</td>
              <td className="border p-2 space-x-2 w-28">
                <button
                  onClick={() => handleEdit(item)}
                  className="px-2 py-1 text-primary rounded hover:text-secondary"
                >
                  <MdEditSquare size={22}/>
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-2 py-1 text-cancelPrimary rounded hover:text-cancelSecondary"
                >
                  <MdDeleteForever size={24}/>
                </button>
              </td>
            </tr>
          ))}
          {socialLinks.length === 0 && (
            <tr>
              <td colSpan={3} className="p-4 text-gray-500">
                No social links added.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </motion.div>
  );
};

export default SocialLinksForm;
