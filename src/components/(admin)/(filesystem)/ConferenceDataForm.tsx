"use client";
import React, { useState, useEffect, useRef } from "react";
import JsonEditor from "../admin/tools/JsonEditor";
import ImageUploader from "../admin/tools/ImageUploader";
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
            className="modern-input"
            required
          />
          <input
            type="text"
            placeholder="Authors"
            value={formData.authors}
            onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
            className="modern-input"
            required
          />
          <input
            type="text"
            placeholder="Publication Date (e.g., 17 Oct 2023)"
            value={formData.publicationDate}
            onChange={(e) => setFormData({ ...formData, publicationDate: e.target.value })}
            className="modern-input"
            required
          />
          <input
            type="text"
            placeholder="Link"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            className="modern-input"
          />
        </section>
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="modern-input"
          required
        />

        <button type="submit" disabled={loading} className="px-6 py-2 bg-secondary text-white rounded hover:bg-blue-700 transition">
          {editingId ? "Update Conference" : "Add Conference"}
        </button>
      </form>

      {/* Responsive Table Container */}
      <div className="modern-table-container">
        <table className="modern-table">
          <thead>
            <tr className="modern-table-tr">
              <th className="min-w-32 modern-table-th">Image</th>
              <th className="min-w-32 modern-table-th">Title</th>
              <th className="min-w-44 modern-table-th">Link</th>
              <th className="min-w-32 modern-table-th">Authors</th>
              <th className="min-w-32 modern-table-th">Publication Date</th>
              <th className="min-w-28 modern-table-th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {conferences.map((item: any) => (
              <tr key={item.id} className="modern-table-tr">
                <td className="modern-table-td">
                  {item.imageSrc && (
                    <img src={item.imageSrc} alt="Project" className="w-16 h-16 mx-auto object-cover rounded" />
                  )}
                </td>
                <td className="modern-table-td">{item.title}</td>
                <td className="modern-table-td">{item.link}</td>
                <td className="modern-table-td">{item.authors}</td>
                <td className="modern-table-td">{item.publicationDate}</td>
                <td className="modern-table-td space-x-2">
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
            {conferences.length === 0 && (
              <tr>
                <td colSpan={4} className="modern-table-td text-center">No conference entries added.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div >
  );
};

export default ConferenceDataForm;
