"use client";
import React, { useState, useEffect, useRef } from "react";
import JsonEditor from "./tools/JsonEditor";
import ImageUploader from "./tools/ImageUploader";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { MdDeleteForever, MdEditSquare } from "react-icons/md";

const NewsDataForm = () => {
  const [news, setNews] = useState([]);
  // imageSrc is an array of URLs
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    timestamp: "",
    content: "",
    imageSrc: [] as string[],
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  // Use a single ImageUploader for adding one image at a time
  const uploaderRef = useRef<{ uploadImage: () => Promise<string | null> }>(null);

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

  // Function to handle adding a new image from the uploader
  const handleAddImage = async () => {
    if (uploaderRef.current) {
      try {
        const uploadedUrl = await uploaderRef.current.uploadImage();
        if (uploadedUrl) {
          setFormData((prev) => ({
            ...prev,
            imageSrc: [...prev.imageSrc, uploadedUrl],
          }));
        }
      } catch (err) {
        toast.error("Image upload failed.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Start with the existing image URLs from the form.
    let imageUrls = formData.imageSrc;

    // Always attempt to upload a new image.
    if (uploaderRef.current) {
      try {
        const newImageUrl = await uploaderRef.current.uploadImage();
        if (newImageUrl) {
          // Append the new URL to the array.
          imageUrls = [...imageUrls, newImageUrl];
          console.log("Uploader returned new URL:", newImageUrl);
        } else {
          console.log("Uploader did not return a new URL; using existing images:", imageUrls);
        }
      } catch (err) {
        console.error("Image upload failed:", err);
        toast.error("Image upload failed. Please try again.");
        setLoading(false);
        return; // Halt submission if image upload fails
      }
    }

    const dataToSubmit = { ...formData, imageSrc: imageUrls };

    try {
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

  const handleEdit = (item: any) => {
    setFormData(item);
    setEditingId(item.id);
  };

  const handleDelete = async (id: string) => {
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

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-medium text-gray-700 mb-1">Images</label>
          <div className="flex flex-wrap gap-4 mb-3">
            {formData.imageSrc.map((img, index) => (
              <div key={index} className="relative">
                <img src={img} alt="News" className="w-20 h-20 object-cover rounded border" />
              </div>
            ))}
          </div>
          {/* Single ImageUploader for adding one image at a time */}
          <ImageUploader ref={uploaderRef} />
          <button
            type="button"
            onClick={handleAddImage}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Upload Image
          </button>
        </div>
        <section className=" grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="modern-input"
            required
          />
          <input
            type="text"
            placeholder="Author"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="modern-input"
            required
          />
          <input
            type="text"
            placeholder="Timestamp (e.g., 2025-02-24 09:15 AM)"
            value={formData.timestamp}
            onChange={(e) => setFormData({ ...formData, timestamp: e.target.value })}
            className="modern-input"
            required
          />
        </section>
        <textarea
          placeholder="Content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="modern-input"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-secondary text-white rounded hover:bg-blue-700 transition"
        >
          {editingId ? "Update News" : "Add News"}
        </button>
      </form>

      {/* Responsive Table Container */}
      <div className="modern-table-container">
        <table className="modern-table">
          <thead>
            <tr className="modern-table-tr">
              <th className="min-w-32 modern-table-th">Image</th>
              <th className="min-w-32 modern-table-th">Title</th>
              <th className="min-w-32 modern-table-th">Author</th>
              <th className="min-w-32 modern-table-th">Timestamp</th>
              <th className="min-w-28 modern-table-th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {news.map((item: any) => (
              <tr key={item.id} className="modern-table-tr">
                <td className="modern-table-td">
                  {item.imageSrc && (
                    <img src={item.imageSrc} alt="Project" className="w-16 h-16 mx-auto object-cover rounded" />
                  )}
                </td>
                <td className="modern-table-td">{item.title}</td>
                <td className="modern-table-td">{item.author}</td>
                <td className="modern-table-td">{item.timestamp}</td>
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
            {news.length === 0 && (
              <tr>
                <td colSpan={4} className="modern-table-td text-center">
                  No news entries added.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default NewsDataForm;
