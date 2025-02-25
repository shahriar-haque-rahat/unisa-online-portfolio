"use client";

import { useState, useEffect, useRef } from "react";
import JsonEditor from "./tools/JsonEditor";
import ImageUploader from "./tools/ImageUploader";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const BannerDataForm = () => {
  const [banners, setBanners] = useState([]);
  const [formData, setFormData] = useState({ image: null, title: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const uploaderRef = useRef(null);

  const fetchData = async () => {
    try {
      const data = await JsonEditor.getAll("bannerData");
      setBanners(data || []);
    } catch (error) {
      console.error("Error fetching banners:", error);
      toast.error("Failed to fetch banner data.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image;
      if (formData.image && formData.image instanceof File) {
        imageUrl = await uploaderRef.current.uploadImage();
      }

      const dataToSubmit = { ...formData, image: imageUrl };
      if (editingId) {
        await JsonEditor.edit("bannerData", editingId, dataToSubmit);
        toast.success("Banner updated successfully!");
        setEditingId(null);
      } else {
        await JsonEditor.add("bannerData", dataToSubmit);
        toast.success("Banner added successfully!");
      }

      setFormData({ image: null, title: "", description: "" });
      fetchData();
    } catch (error) {
      console.error("Error saving banner:", error);
      toast.error("Failed to save banner.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({ image: item.image, title: item.title, description: item.description });
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      await JsonEditor.delete("bannerData", id);
      toast.success("Banner deleted successfully!");
      fetchData();
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast.error("Failed to delete banner.");
    }
  };

  return (
    <motion.div
      className="bg-white shadow-lg rounded-lg p-6 my-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Banner Data</h2>
      <p className="text-gray-500 mb-6">
        Manage your banner images, titles, and descriptions here.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* IMAGE FIELD */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Banner Image</label>
          <div className="flex items-center gap-4">
            {formData.image && typeof formData.image === "string" && (
              <img
                src={formData.image}
                alt="Banner"
                className="w-20 h-20 object-cover rounded border"
              />
            )}
            <ImageUploader
              ref={uploaderRef}
              onUpload={(file) => setFormData({ ...formData, image: file })}
            />
          </div>
        </div>

        {/* TITLE FIELD */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            placeholder="e.g., Professional Design"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        {/* DESCRIPTION FIELD */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Description</label>
          <textarea
            placeholder="Short description of the banner"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {editingId ? "Update Banner" : "Add Banner"}
        </button>
      </form>

      {/* Table of existing banners */}
      <table className="w-full mt-6 border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="border p-2 text-gray-600">Image</th>
            <th className="border p-2 text-gray-600">Title</th>
            <th className="border p-2 text-gray-600">Description</th>
            <th className="border p-2 text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {banners.map((item) => (
            <tr key={item.id || Math.random()} className="text-center">
              <td className="border p-2">
                {item.image && (
                  <img
                    src={item.image}
                    alt="Banner"
                    className="w-16 h-16 mx-auto object-cover rounded"
                  />
                )}
              </td>
              <td className="border p-2">{item.title}</td>
              <td className="border p-2">{item.description}</td>
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
          {banners.length === 0 && (
            <tr>
              <td colSpan={4} className="p-4 text-gray-500">
                No banners added.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </motion.div>
  );
};

export default BannerDataForm;
