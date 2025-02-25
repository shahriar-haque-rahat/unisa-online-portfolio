"use client";

import { useState, useEffect, useRef } from "react";
import JsonEditor from "./tools/JsonEditor";
import ImageUploader from "./tools/ImageUploader";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const JournalDataForm = () => {
  const [journals, setJournals] = useState([]);
  const [formData, setFormData] = useState({
    imageSrc: null,
    title: "",
    authors: "",
    publicationDate: "",
    description: "",
    link: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const uploaderRef = useRef(null);

  const fetchData = async () => {
    try {
      const data = await JsonEditor.getAll("journalData");
      setJournals(data || []);
    } catch (error) {
      console.error("Error fetching journals:", error);
      toast.error("Failed to fetch journal data.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = formData.imageSrc;
      if (formData.imageSrc && formData.imageSrc instanceof File) {
        imageUrl = await uploaderRef.current.uploadImage();
      }
      const dataToSubmit = { ...formData, imageSrc: imageUrl };

      if (editingId) {
        await JsonEditor.edit("journalData", editingId, dataToSubmit);
        toast.success("Journal updated successfully!");
        setEditingId(null);
      } else {
        await JsonEditor.add("journalData", dataToSubmit);
        toast.success("Journal added successfully!");
      }

      setFormData({
        imageSrc: null,
        title: "",
        authors: "",
        publicationDate: "",
        description: "",
        link: "",
      });
      fetchData();
    } catch (error) {
      console.error("Error saving journal:", error);
      toast.error("Failed to save journal.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({ ...item, imageSrc: item.imageSrc });
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this journal entry?")) return;
    try {
      await JsonEditor.delete("journalData", id);
      toast.success("Journal deleted successfully!");
      fetchData();
    } catch (error) {
      console.error("Error deleting journal:", error);
      toast.error("Failed to delete journal.");
    }
  };

  return (
    <motion.div
      className="bg-white shadow-lg rounded-lg p-6 my-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Journal Data</h2>
      <p className="text-gray-500 mb-6">Manage journal entries here.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* IMAGE FIELD */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Journal Image</label>
          <div className="flex items-center gap-4">
            {formData.imageSrc && typeof formData.imageSrc === "string" && (
              <img
                src={formData.imageSrc}
                alt="Journal"
                className="w-20 h-20 object-cover rounded border"
              />
            )}
            <ImageUploader
              ref={uploaderRef}
              onUpload={(file) => setFormData({ ...formData, imageSrc: file })}
            />
          </div>
        </div>

        {/* Title, Authors, PublicationDate, Description, Link */}
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
        <input
          type="text"
          placeholder="Authors"
          value={formData.authors}
          onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
        <input
          type="text"
          placeholder="Publication Date (e.g., 17 Oct 2024)"
          value={formData.publicationDate}
          onChange={(e) => setFormData({ ...formData, publicationDate: e.target.value })}
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
          placeholder="Link"
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {editingId ? "Update Journal" : "Add Journal"}
        </button>
      </form>

      <table className="w-full mt-6 border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="border p-2 text-gray-600">Title</th>
            <th className="border p-2 text-gray-600">Authors</th>
            <th className="border p-2 text-gray-600">Publication Date</th>
            <th className="border p-2 text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {journals.map((item) => (
            <tr key={item.id} className="text-center">
              <td className="border p-2">{item.title}</td>
              <td className="border p-2">{item.authors}</td>
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
          {journals.length === 0 && (
            <tr>
              <td colSpan={4} className="p-4 text-gray-500">
                No journal entries added.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </motion.div>
  );
};

export default JournalDataForm;
