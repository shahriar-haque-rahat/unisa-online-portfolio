"use client";
import React, { useState, useEffect, useRef } from "react";
import JsonEditor from "../admin/tools/JsonEditor";
import ImageUploaderEdgestore from "../admin/tools/ImageUploaderEdgestore";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { MdDeleteForever, MdEditSquare } from "react-icons/md";
import { useEdgeStore } from "@/edgestore/edgestore";

const NewsDataForm = () => {
  const [news, setNews] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    timestamp: "",
    content: "",
    imageSrc: [] as string[],
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const uploaderRef = useRef<{ uploadImage: () => Promise<string | null> }>(null);

  // Get the Edgestore client
  const { edgestore } = useEdgeStore();

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

  // Adds an image to the form by uploading via Edgestore uploader.
  // This button is separate from the submit button.
  const handleAddImage = async () => {
    if (uploaderRef.current) {
      try {
        const uploadedUrl = await uploaderRef.current.uploadImage();
        if (uploadedUrl) {
          setFormData((prev) => ({
            ...prev,
            imageSrc: [...prev.imageSrc, uploadedUrl],
          }));
          console.log("Added image URL:", uploadedUrl);
        }
      } catch (err) {
        toast.error("Image upload failed.");
      }
    }
  };

  // Remove a single image from the form state and delete it from Edgestore.
  const handleRemoveImage = async (index: number) => {
    const imageToRemove = formData.imageSrc[index];
    // Update UI immediately.
    const updatedImages = formData.imageSrc.filter((_, i) => i !== index);
    setFormData({ ...formData, imageSrc: updatedImages });

    // Delete the image from Edgestore.
    try {
      await edgestore.publicFiles.delete({ url: imageToRemove });
      toast.success("Image removed successfully!");
    } catch (err) {
      console.error("Error deleting image:", err);
      toast.error("Failed to delete image from Edgestore.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Here, we simply use the existing formData.imageSrc array.
    const dataToSubmit = { ...formData };

    try {
      if (editingId) {
        await JsonEditor.edit("newsData", editingId, dataToSubmit);
        toast.success("News updated successfully!");
        setEditingId(null);
      } else {
        await JsonEditor.add("newsData", dataToSubmit);
        toast.success("News added successfully!");
      }
      // Reset form data.
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

  // When deleting an entire news entry, remove all associated images from Edgestore.
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this news entry?")) return;
    try {
      // Find the news entry to delete (to get its images)
      const newsToDelete = news.find((item) => item.id === id);
      await JsonEditor.delete("newsData", id);
      toast.success("News deleted successfully!");
  
      // Group deletion: delete all images associated with this news entry using Promise.all
      if (newsToDelete?.imageSrc && Array.isArray(newsToDelete.imageSrc)) {
        await Promise.all(
          newsToDelete.imageSrc.map(async (img: string) => {
            try {
              await edgestore.publicFiles.delete({ url: img });
              console.log("Deleted image from Edgestore:", img);
            } catch (error) {
              console.error("Failed to delete image from Edgestore:", img, error);
            }
          })
        );
      }
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
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                >
                  <MdDeleteForever size={14} />
                </button>
              </div>
            ))}
          </div>
          <ImageUploaderEdgestore ref={uploaderRef} />
          <button
            type="button"
            onClick={handleAddImage}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Upload Image
          </button>
        </div>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      <div className="modern-table-container mt-8">
        <table className="modern-table w-full">
          <thead>
            <tr className="modern-table-tr">
              <th className="min-w-32 modern-table-th">Images</th>
              <th className="min-w-32 modern-table-th">Title</th>
              <th className="min-w-32 modern-table-th">Author</th>
              <th className="min-w-32 modern-table-th">Timestamp</th>
              <th className="min-w-28 modern-table-th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {news.map((item) => (
              <tr key={item.id} className="modern-table-tr">
                <td className="modern-table-td">
                  <div className="grid grid-cols-3 gap-2">
                    {item.imageSrc &&
                      item.imageSrc.map((img: string, idx: number) => (
                        <img
                          key={idx}
                          src={img}
                          alt="News Thumbnail"
                          className="w-12 h-12 object-cover rounded border"
                        />
                      ))}
                  </div>
                </td>
                <td className="modern-table-td">{item.title}</td>
                <td className="modern-table-td">{item.author}</td>
                <td className="modern-table-td">{item.timestamp}</td>
                <td className="modern-table-td">
                  <button onClick={() => handleEdit(item)} className="modern-edit-btn">
                    <MdEditSquare size={22} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="modern-delete-btn">
                    <MdDeleteForever size={24} />
                  </button>
                </td>
              </tr>
            ))}
            {news.length === 0 && (
              <tr>
                <td colSpan={5} className="modern-table-td text-center">
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
