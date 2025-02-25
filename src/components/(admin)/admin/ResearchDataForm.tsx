"use client";
import React, { useState, useEffect, useRef } from "react";
import JsonEditor from "./tools/JsonEditor";
import ImageUploader from "./tools/ImageUploader";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { MdDeleteForever, MdEditSquare } from "react-icons/md";

// Define the type for the research form data.
type ResearchFormData = {
  imageSrc: string | File | null;
  title: string;
  description: string;
  publicationName: string;
  publicationDate: string;
};

const ResearchDataForm = () => {
  const [researchEntries, setResearchEntries] = useState<any[]>([]);
  const [formData, setFormData] = useState<ResearchFormData>({
    imageSrc: null,
    title: "",
    description: "",
    publicationName: "",
    publicationDate: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const uploaderRef = useRef<{ uploadImage: () => Promise<string | null> }>(null);

  const fetchData = async () => {
    try {
      const data = await JsonEditor.getAll("researchData");
      setResearchEntries(data || []);
    } catch (error) {
      console.error("Error fetching research data:", error);
      toast.error("Failed to fetch research data.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Start with the existing image URL if formData.imageSrc is already a string.
    let imageUrl: string | null = typeof formData.imageSrc === "string" ? formData.imageSrc : null;

    // Always attempt to upload the image, just like BannerDataForm.
    if (uploaderRef.current) {
      try {
        const newImageUrl = await uploaderRef.current.uploadImage();
        if (newImageUrl) {
          imageUrl = newImageUrl;
          console.log("Uploader returned new URL:", imageUrl);
        } else {
          console.log("Uploader did not return a new URL; using existing image URL:", imageUrl);
        }
      } catch (err) {
        console.error("Image upload failed:", err);
        toast.error("Image upload failed. Please try again.");
        setLoading(false);
        return; // Stop submission if upload fails.
      }
    }

    const dataToSubmit = { ...formData, imageSrc: imageUrl };
    try {
      if (editingId) {
        await JsonEditor.edit("researchData", editingId, dataToSubmit);
        toast.success("Research updated successfully!");
        setEditingId(null);
      } else {
        await JsonEditor.add("researchData", dataToSubmit);
        toast.success("Research added successfully!");
      }
      setFormData({
        imageSrc: null,
        title: "",
        description: "",
        publicationName: "",
        publicationDate: "",
      });
      fetchData();
    } catch (error) {
      console.error("Error saving research data:", error);
      toast.error("Failed to save research data.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setFormData({ ...item, imageSrc: item.imageSrc });
    setEditingId(item.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this research entry?")) return;
    try {
      await JsonEditor.delete("researchData", id);
      toast.success("Research entry deleted successfully!");
      fetchData();
    } catch (error) {
      console.error("Error deleting research data:", error);
      toast.error("Failed to delete research entry.");
    }
  };

  return (
    <motion.div
      className="bg-white shadow-lg rounded-lg p-6 my-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Research Data</h2>
      <p className="text-gray-500 mb-6">Manage your research entries here.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Research Image Field */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Research Image</label>
          <div className="flex items-center gap-4">
            {formData.imageSrc && typeof formData.imageSrc === "string" && (
              <img
                src={formData.imageSrc}
                alt="Research"
                className="w-20 h-20 object-cover rounded border"
              />
            )}
            <ImageUploader
              ref={uploaderRef}
              onUpload={(url) => setFormData({ ...formData, imageSrc: url })}
            />
          </div>
        </div>
        <section className=" grid grid-cols-1 md:grid-cols-2 gap-4">
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
            placeholder="Publication Name"
            value={formData.publicationName}
            onChange={(e) => setFormData({ ...formData, publicationName: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
          <input
            type="text"
            placeholder="Publication Date (e.g., January 15, 2023)"
            value={formData.publicationDate}
            onChange={(e) => setFormData({ ...formData, publicationDate: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </section>
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-secondary text-white rounded hover:bg-blue-700 transition"
        >
          {editingId ? "Update Research" : "Add Research"}
        </button>
      </form>

      <table className="w-full mt-6 border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="border p-2 text-gray-600">Image</th>
            <th className="border p-2 text-gray-600">Title</th>
            <th className="border p-2 text-gray-600">Publication Name</th>
            <th className="border p-2 text-gray-600">Publication Date</th>
            <th className="border p-2 text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {researchEntries.map((item: any) => (
            <tr key={item.id} className="text-center">
              <td className="border p-2 w-28">
                {item.imageSrc && (
                  <img src={item.imageSrc} alt="Project" className="w-16 h-16 mx-auto object-cover rounded" />
                )}
              </td>
              <td className="border p-2">{item.title}</td>
              <td className="border p-2">{item.publicationName}</td>
              <td className="border p-2">{item.publicationDate}</td>
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
          {researchEntries.length === 0 && (
            <tr>
              <td colSpan={4} className="p-4 text-gray-500">No research entries added.</td>
            </tr>
          )}
        </tbody>
      </table>
    </motion.div>
  );
};

export default ResearchDataForm;
