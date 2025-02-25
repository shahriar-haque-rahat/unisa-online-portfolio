"use client";

import { useState, useEffect, useRef } from "react";
import JsonEditor from "./tools/JsonEditor";
import ImageUploader from "./tools/ImageUploader";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const NewsDataForm = () => {
  const [news, setNews] = useState([]);
  // imageSrc is an array that may hold File objects or string URLs
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    timestamp: "",
    content: "",
    imageSrc: [],
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const uploaderRef = useRef(null);

  const fetchData = async () => {
    try {
      const data = await JsonEditor.getAll("newsData");
      setNews(data || []);
    } catch (error) {
      console.error("Error fetching news:", error);
      toast.error("Failed to fetch news data.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload each file if needed
      const uploadedImages = [];
      for (let fileOrUrl of formData.imageSrc) {
        if (fileOrUrl instanceof File) {
          const url = await uploaderRef.current.uploadImage();
          uploadedImages.push(url);
        } else {
          uploadedImages.push(fileOrUrl);
        }
      }

      const dataToSubmit = { ...formData, imageSrc: uploadedImages };
      if (editingId) {
        await JsonEditor.edit("newsData", editingId, dataToSubmit);
        toast.success("News updated successfully!");
        setEditingId(null);
      } else {
        await JsonEditor.add("newsData", dataToSubmit);
        toast.success("News added successfully!");
      }

      setFormData({ title: "", author: "", timestamp: "", content: "", imageSrc: [] });
      fetchData();
    } catch (error) {
      console.error("Error saving news:", error);
      toast.error("Failed to save news.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this news entry?")) return;
    try {
      await JsonEditor.delete("newsData", id);
      toast.success("News deleted successfully!");
      fetchData();
    } catch (error) {
      console.error("Error deleting news:", error);
      toast.error("Failed to delete news.");
    }
  };

  return (
    <motion.div
      className="bg-white shadow-lg rounded-lg p-6 my-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-2">News Data</h2>
      <p className="text-gray-500 mb-6">Manage your news entries here.</p>

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
          type="text"
          placeholder="Author"
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
        <input
          type="text"
          placeholder="Timestamp (e.g., 2025-02-24 09:15 AM)"
          value={formData.timestamp}
          onChange={(e) => setFormData({ ...formData, timestamp: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
        <textarea
          placeholder="Content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
        <div>
          <label className="block font-medium text-gray-700 mb-1">Images</label>
          <div className="flex flex-wrap gap-4 mb-3">
            {formData.imageSrc.map((img, index) => (
              <div key={index} className="relative">
                {typeof img === "string" && (
                  <img src={img} alt="News" className="w-20 h-20 object-cover rounded border" />
                )}
              </div>
            ))}
          </div>
          {/* Multiple image selection via ImageUploader */}
          <ImageUploader
            ref={uploaderRef}
            onUpload={(file) => setFormData({ ...formData, imageSrc: [...formData.imageSrc, file] })}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {editingId ? "Update News" : "Add News"}
        </button>
      </form>

      <table className="w-full mt-6 border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="border p-2 text-gray-600">Title</th>
            <th className="border p-2 text-gray-600">Author</th>
            <th className="border p-2 text-gray-600">Timestamp</th>
            <th className="border p-2 text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {news.map((item) => (
            <tr key={item.id} className="text-center">
              <td className="border p-2">{item.title}</td>
              <td className="border p-2">{item.author}</td>
              <td className="border p-2">{item.timestamp}</td>
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
          {news.length === 0 && (
            <tr>
              <td colSpan={4} className="p-4 text-gray-500">
                No news entries added.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </motion.div>
  );
};

export default NewsDataForm;
