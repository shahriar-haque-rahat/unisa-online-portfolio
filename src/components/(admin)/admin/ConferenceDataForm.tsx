"use client";
import React, { useState, useEffect, useRef } from "react";
import JsonEditor from "./tools/JsonEditor";
import ImageUploader from "./tools/ImageUploader";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { MdDeleteForever, MdEditSquare } from "react-icons/md";

// Define a type for the form data.
type ConferenceFormData = {
  imageSrc: string | File | null;
  title: string;
  authors: string;
  publicationDate: string;
  description: string;
  link: string;
};

const ConferenceDataForm = () => {
  const [conferences, setConferences] = useState<any[]>([]);
  const [formData, setFormData] = useState<ConferenceFormData>({
    imageSrc: null,
    title: "",
    authors: "",
    publicationDate: "",
    description: "",
    link: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const uploaderRef = useRef<{ uploadImage: () => Promise<string | null> }>(null);

  const fetchData = async () => {
    try {
      const data = await JsonEditor.getAll("conferenceData");
      setConferences(data || []);
    } catch (error) {
      console.error("Error fetching conferences:", error);
      toast.error("Failed to fetch conference data.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("Submitting Conference form. Current formData:", formData);

    // If formData.imageSrc is a string, use it as the initial imageUrl.
    let imageUrl: string | null = typeof formData.imageSrc === "string" ? formData.imageSrc : null;

    // Always attempt to upload the image.
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
        return; // Halt submission if image upload fails
      }
    }

    const dataToSubmit = { ...formData, imageSrc: imageUrl };
    try {
      if (editingId) {
        console.log("Editing conference with id:", editingId, "data:", dataToSubmit);
        await JsonEditor.edit("conferenceData", editingId, dataToSubmit);
        toast.success("Conference updated successfully!");
        setEditingId(null);
      } else {
        console.log("Adding new conference with data:", dataToSubmit);
        await JsonEditor.add("conferenceData", dataToSubmit);
        toast.success("Conference added successfully!");
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
      console.error("Error saving conference:", error);
      toast.error("Failed to save conference.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setFormData({ ...item, imageSrc: item.imageSrc });
    setEditingId(item.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;
    try {
      await JsonEditor.delete("conferenceData", id);
      toast.success("Conference deleted successfully!");
      fetchData();
    } catch (error) {
      console.error("Error deleting conference:", error);
      toast.error("Failed to delete conference.");
    }
  };

  return (
    <motion.div
      className="bg-white shadow-lg rounded-lg p-6 my-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Conference Data</h2>
      <p className="text-gray-500 mb-6">Manage conference entries here.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Image Field */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Conference Image</label>
          <div className="flex items-center gap-4">
            {formData.imageSrc && typeof formData.imageSrc === "string" && (
              <img
                src={formData.imageSrc}
                alt="Conference"
                className="w-20 h-20 object-cover rounded border"
              />
            )}
            <ImageUploader
              ref={uploaderRef}
              onUpload={(url) => {
                console.log("Conference ImageUploader onUpload called with:", url);
                setFormData({ ...formData, imageSrc: url });
              }}
            />
          </div>
        </div>
        {/* Other fields */}
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
            placeholder="Authors"
            value={formData.authors}
            onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
          <input
            type="text"
            placeholder="Publication Date (e.g., 17 Oct 2023)"
            value={formData.publicationDate}
            onChange={(e) => setFormData({ ...formData, publicationDate: e.target.value })}
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
        </section>
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />

        <button type="submit" disabled={loading} className="px-6 py-2 bg-secondary text-white rounded hover:bg-blue-700 transition">
          {editingId ? "Update Conference" : "Add Conference"}
        </button>
      </form>

      {/* Table */}
      <table className="w-full mt-6 border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="border p-2 text-gray-600">Image</th>
            <th className="border p-2 text-gray-600">Title</th>
            <th className="border p-2 text-gray-600">Authors</th>
            <th className="border p-2 text-gray-600">Publication Date</th>
            <th className="border p-2 text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {conferences.map((item: any) => (
            <tr key={item.id} className="text-center">
              <td className="border p-2 w-28">
                {item.imageSrc && (
                  <img src={item.imageSrc} alt="Project" className="w-16 h-16 mx-auto object-cover rounded" />
                )}
              </td>
              <td className="border p-2">{item.title}</td>
              <td className="border p-2">{item.authors}</td>
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
          {conferences.length === 0 && (
            <tr>
              <td colSpan={4} className="p-4 text-gray-500">No conference entries added.</td>
            </tr>
          )}
        </tbody>
      </table>
    </motion.div>
  );
};

export default ConferenceDataForm;
