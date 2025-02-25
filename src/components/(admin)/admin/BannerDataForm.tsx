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
          className="px-6 py-2 bg-secondary text-white rounded hover:bg-blue-700 transition"
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
          {banners.map((item: any) => (
            <tr key={item.id || Math.random()} className="text-center">
              <td className="border p-2 w-28">
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
              <td className="border p-2 space-x-2 w-28">
                <button
                  onClick={() => handleEdit(item)}
                  className="px-2 py-1 text-primary rounded hover:text-secondary"
                >
                  <MdEditSquare size={22} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-2 py-1 text-cancelPrimary rounded hover:text-cancelSecondary"
                >
                  <MdDeleteForever size={24} />
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
