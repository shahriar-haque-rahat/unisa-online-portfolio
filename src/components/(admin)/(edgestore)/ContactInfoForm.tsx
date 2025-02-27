"use client";
import React, { useEffect, useState } from "react";
import JsonEditor from "../admin/tools/JsonEditor";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { MdDeleteForever, MdEditSquare } from "react-icons/md";

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

  const handleSubmit = async (e: React.FormEvent) => {
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

  const handleEdit = (item: any) => {
    setFormData({ label: item.label, value: item.value, link: item.link || "" });
    setEditingId(item.id);
  };

  const handleDelete = async (id: string) => {
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

      <form onSubmit={handleSubmit} className="space-y-5">
        <section className=" grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Label (e.g., Address, Phone)"
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            className="modern-input"
            required
          />
          <input
            type="text"
            placeholder="Value"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            className="modern-input"
            required
          />
          <input
            type="text"
            placeholder="Link (optional)"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            className="modern-input"
          />
        </section>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-secondary text-white rounded hover:bg-blue-700 transition"
        >
          {editingId ? "Update Contact" : "Add Contact"}
        </button>
      </form>

      {/* Responsive Table Container */}
      <div className="modern-table-container">
        <table className="modern-table">
          <thead>
            <tr className="modern-table-tr">
              <th className="min-w-32 modern-table-th">Label</th>
              <th className="min-w-32 modern-table-th">Value</th>
              <th className="min-w-44 modern-table-th">Link</th>
              <th className="min-w-28 modern-table-th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contactInfo.map((item: any) => (
              <tr key={item.id} className="modern-table-tr">
                <td className="modern-table-td">{item.label}</td>
                <td className="modern-table-td">{item.value}</td>
                <td className="modern-table-td">{item.link}</td>
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
            {contactInfo.length === 0 && (
              <tr>
                <td colSpan={4} className="modern-table-td text-center">
                  No contact info added.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div >
  );
};

export default ContactInfoForm;
