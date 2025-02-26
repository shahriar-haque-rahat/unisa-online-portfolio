"use client";
import React, { useState, useEffect, useRef } from "react";
import JsonEditor from "./tools/JsonEditor";
import ImageUploader from "./tools/ImageUploader";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { MdDeleteForever, MdEditSquare } from "react-icons/md";

type BannerFormData = {
  image: string | File | null;
  title: string;
  description: string;
};

const BannerDataForm = () => {
  const [banners, setBanners] = useState<any[]>([]);
  const [formData, setFormData] = useState<BannerFormData>({
    image: null,
    title: "",
    description: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const uploaderRef = useRef<{ uploadImage: () => Promise<string | null> }>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("Submitting form. Current formData:", formData);

    // Get the existing image URL if formData.image is already a string
    let imageUrl: string | null = typeof formData.image === "string" ? formData.image : null;

    // Always call the uploader to attempt to upload a new file.
    if (uploaderRef.current) {
      try {
        const newImageUrl = await uploaderRef.current.uploadImage();
        if (newImageUrl) {
          imageUrl = newImageUrl;
          console.log("Uploader returned URL:", imageUrl);
        } else {
          console.log("Uploader did not return a new URL; using existing image URL:", imageUrl);
        }
      } catch (err) {
        console.error("Image upload failed:", err);
        toast.error("Image upload failed. Please try again.");
        setLoading(false);
        return; // Halt submission if image upload fails
      }
    }

    const dataToSubmit = { ...formData, image: imageUrl };
    console.log(editingId ? "Editing banner with id:" + editingId : "Adding new banner with data:", dataToSubmit);
    try {
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

  const handleEdit = (item: any) => {
    console.log("Editing item:", item);
    setFormData({ image: item.image, title: item.title, description: item.description });
    setEditingId(item.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      console.log("Deleting banner with id:", id);
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
              onUpload={(url) => {
                console.log("ImageUploader onUpload called with url:", url);
                setFormData({ ...formData, image: url });
              }}
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
            className="modern-input"
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
            className="modern-input"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-secondary text-white rounded hover:bg-blue-700 transition"
        >
          {editingId ? "Update Banner" : "Add Banner"}
        </button>
      </form>

      {/* Responsive Table Container */}
      <div className="modern-table-container">
        <table className="modern-table">
          <thead>
            <tr className="modern-table-tr">
              <th className="min-w-32 modern-table-th">Image</th>
              <th className="min-w-32 modern-table-th">Title</th>
              <th className="min-w-32 modern-table-th">Description</th>
              <th className="min-w-28 modern-table-th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((item: any) => (
              <tr key={item.id || Math.random()} className="modern-table-tr">
                <td className="modern-table-td">
                  {item.image && (
                    <img
                      src={item.image}
                      alt="Banner"
                      className="modern-table-img"
                    />
                  )}
                </td>
                <td className="modern-table-td">{item.title}</td>
                <td className="modern-table-td">{item.description}</td>
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
            {banners.length === 0 && (
              <tr>
                <td colSpan={4} className="modern-table-td text-center">
                  No banners added.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default BannerDataForm;
