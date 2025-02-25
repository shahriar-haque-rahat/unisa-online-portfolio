"use client";

import { useState, useEffect } from "react";
import JsonEditor from "./tools/JsonEditor";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const ContactInfoForm = () => {
  const [contactInfo, setContactInfo] = useState([]);
  const [formData, setFormData] = useState({ label: "", value: "", link: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const data = await JsonEditor.getAll("contactInfo");
      setContactInfo(data || []);
    } catch (error) {
      console.error("Error fetching contact info:", error);
      toast.error("Failed to fetch contact info.");
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
        await JsonEditor.edit("contactInfo", editingId, formData);
        toast.success("Contact updated successfully!");
        setEditingId(null);
      } else {
        await JsonEditor.add("contactInfo", formData);
        toast.success("Contact added successfully!");
      }
      setFormData({ label: "", value: "", link: "" });
      fetchData();
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save contact info.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({ label: item.label, value: item.value, link: item.link || "" });
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;
    try {
      await JsonEditor.delete("contactInfo", id);
      toast.success("Contact deleted successfully!");
      fetchData();
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error("Failed to delete contact.");
    }
  };

  return (
    <motion.div
      className="bg-white shadow-lg rounded-lg p-6 my-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Contact Information</h2>
      <p className="text-gray-500 mb-6">
        Manage your contact details such as phone, email, and address.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          placeholder="Label (e.g., Address, Phone)"
          value={formData.label}
          onChange={(e) => setFormData({ ...formData, label: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
        <input
          type="text"
          placeholder="Value"
          value={formData.value}
          onChange={(e) => setFormData({ ...formData, value: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
        <input
          type="text"
          placeholder="Link (optional)"
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {editingId ? "Update Contact" : "Add Contact"}
        </button>
      </form>

      <table className="w-full mt-6 border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="border p-2 text-gray-600">Label</th>
            <th className="border p-2 text-gray-600">Value</th>
            <th className="border p-2 text-gray-600">Link</th>
            <th className="border p-2 text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {contactInfo.map((item) => (
            <tr key={item.id} className="text-center">
              <td className="border p-2">{item.label}</td>
              <td className="border p-2">{item.value}</td>
              <td className="border p-2">{item.link}</td>
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
          {contactInfo.length === 0 && (
            <tr>
              <td colSpan={4} className="p-4 text-gray-500">
                No contact info added.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </motion.div>
  );
};

export default ContactInfoForm;
