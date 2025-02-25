"use client";
import React, { useState, useEffect } from "react";
import JsonEditor from "./tools/JsonEditor";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { MdDeleteForever, MdEditSquare } from "react-icons/md";

const CountersDataForm = () => {
  const [counters, setCounters] = useState([]);
  const [formData, setFormData] = useState({ title: "", value: 0 });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const data = await JsonEditor.getAll("countersData");
      setCounters(data || []);
    } catch (error) {
      console.error("Error fetching counters:", error);
      toast.error("Failed to fetch counters data.");
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
        await JsonEditor.edit("countersData", editingId, formData);
        toast.success("Counter updated successfully!");
        setEditingId(null);
      } else {
        await JsonEditor.add("countersData", formData);
        toast.success("Counter added successfully!");
      }
      setFormData({ title: "", value: 0 });
      fetchData();
    } catch (error) {
      console.error("Error saving counter:", error);
      toast.error("Failed to save counter.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setFormData({ title: item.title, value: item.value });
    setEditingId(item.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this counter?")) return;
    try {
      await JsonEditor.delete("countersData", id);
      toast.success("Counter deleted successfully!");
      fetchData();
    } catch (error) {
      console.error("Error deleting counter:", error);
      toast.error("Failed to delete counter.");
    }
  };

  return (
    <motion.div className="bg-white shadow-lg rounded-lg p-6 my-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Counters Data</h2>
      <p className="text-gray-500 mb-6">Manage numeric counters (e.g., stats or achievements).</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
        <input
          type="number"
          placeholder="Value"
          value={formData.value}
          onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-secondary text-white rounded hover:bg-blue-700 transition"
        >
          {editingId ? "Update Counter" : "Add Counter"}
        </button>
      </form>

      <table className="w-full mt-6 border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="border p-2 text-gray-600">Title</th>
            <th className="border p-2 text-gray-600">Value</th>
            <th className="border p-2 text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {counters.map((item: any) => (
            <tr key={item.id} className="text-center">
              <td className="border p-2">{item.title}</td>
              <td className="border p-2">{item.value}</td>
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
          {counters.length === 0 && (
            <tr>
              <td colSpan={3} className="p-4 text-gray-500">
                No counters added.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </motion.div>
  );
};

export default CountersDataForm;
