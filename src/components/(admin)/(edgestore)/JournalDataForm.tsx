"use client";
import React, { useState, useEffect, useRef } from "react";
import JsonEditor from "../admin/tools/JsonEditor";
import ImageUploaderEdgestore from "../admin/tools/ImageUploaderEdgestore";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { MdDeleteForever, MdEditSquare } from "react-icons/md";
import { useEdgeStore } from "@/edgestore/edgestore";

type JournalFormData = {
  imageSrc: string | File | null;
  title: string;
  authors: string;
  publicationDate: string;
  description: string;
  link: string;
};

const JournalDataForm = () => {
  const [journals, setJournals] = useState<any[]>([]);
  const [formData, setFormData] = useState<JournalFormData>({
    imageSrc: null,
    title: "",
    authors: "",
    publicationDate: "",
    description: "",
    link: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const uploaderRef = useRef<{ uploadImage: () => Promise<string | null> }>(null);

  const { edgestore } = useEdgeStore();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl: string | null =
      typeof formData.imageSrc === "string" ? formData.imageSrc : null;

    // Attempt to upload a new image
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
        return;
      }
    }

    const dataToSubmit = { ...formData, imageSrc: imageUrl };
    try {
      if (editingId) {
        await JsonEditor.edit("journalData", editingId, dataToSubmit);
        toast.success("Journal updated successfully!");
        // If a new image was uploaded, delete the old image from Edgestore
        if (originalImage && originalImage !== imageUrl) {
          try {
            await edgestore.publicFiles.delete({ url: originalImage });
            console.log("Deleted old image from Edgestore:", originalImage);
          } catch (error) {
            console.error("Failed to delete old image from Edgestore:", error);
          }
        }
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
      setOriginalImage(null);
      fetchData();
    } catch (error) {
      console.error("Error saving journal:", error);
      toast.error("Failed to save journal.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setFormData({ ...item, imageSrc: item.imageSrc });
    setOriginalImage(item.imageSrc);
    setEditingId(item.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this journal entry?")) return;
    try {
      const journalToDelete = journals.find((item) => item.id === id);
      await JsonEditor.delete("journalData", id);
      toast.success("Journal deleted successfully!");
      if (journalToDelete?.imageSrc) {
        try {
          await edgestore.publicFiles.delete({ url: journalToDelete.imageSrc });
          console.log("Deleted image from Edgestore:", journalToDelete.imageSrc);
        } catch (error) {
          console.error("Failed to delete image from Edgestore:", error);
        }
      }
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
            <ImageUploaderEdgestore
              ref={uploaderRef}
              onUpload={(url: string) => {
                console.log("ImageUploaderEdgestore onUpload called with:", url);
                setFormData({ ...formData, imageSrc: url });
              }}
            />
          </div>
        </div>
        {/* Other Fields */}
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
            placeholder="Authors"
            value={formData.authors}
            onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
            className="modern-input"
            required
          />
          <input
            type="text"
            placeholder="Publication Date (e.g., 17 Oct 2024)"
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
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-secondary text-white rounded hover:bg-blue-700 transition"
        >
          {editingId ? "Update Journal" : "Add Journal"}
        </button>
      </form>
      <div className="modern-table-container">
        <table className="modern-table">
          <thead>
            <tr className="modern-table-tr">
              <th className="min-w-32 modern-table-th">Image</th>
              <th className="min-w-32 modern-table-th">Title</th>
              <th className="min-w-44 modern-table-th">Link</th>
              <th className="min-w-44 modern-table-th">Authors</th>
              <th className="min-w-32 modern-table-th">Publication Date</th>
              <th className="min-w-28 modern-table-th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {journals.map((item: any) => (
              <tr key={item.id} className="modern-table-tr">
                <td className="modern-table-td">
                  {item.imageSrc && (
                    <img src={item.imageSrc} alt="Journal" className="w-16 h-16 mx-auto object-cover rounded" />
                  )}
                </td>
                <td className="modern-table-td">{item.title}</td>
                <td className="modern-table-td">{item.link}</td>
                <td className="modern-table-td">{item.authors}</td>
                <td className="modern-table-td">{item.publicationDate}</td>
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
            {journals.length === 0 && (
              <tr>
                <td colSpan={6} className="modern-table-td text-center">
                  No journal entries added.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default JournalDataForm;
