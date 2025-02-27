"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ImageUploader from "../admin/tools/ImageUploader";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const LogoForm = () => {
  const [logoData, setLogoData] = useState({ image: "", content: "" });
  const uploaderRef = useRef<{ uploadImage: () => Promise<string | null> }>(null);
  const [loading, setLoading] = useState(false);

  const fetchLogo = async () => {
    try {
      const res = await axios.get("/api/data/logo");
      if (res.data && typeof res.data === "object") {
        setLogoData({
          image: res.data.image || "",
          content: res.data.content || "",
        });
      }
    } catch (error) {
      console.error("Error fetching logo:", error);
      toast.error("Failed to fetch logo data.");
    }
  };

  useEffect(() => {
    fetchLogo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let finalImage = logoData.image;
    if (uploaderRef.current) {
      try {
        const uploadedUrl = await uploaderRef.current.uploadImage();
        if (uploadedUrl) {
          finalImage = uploadedUrl;
        }
      } catch (err) {
        toast.error("Image upload failed. Please try again.");
        setLoading(false);
        return;
      }
    }
    const payload = { image: finalImage, content: logoData.content };
    try {
      await axios.post("/api/data/logo", payload);
      toast.success("Logo updated successfully!");
      fetchLogo();
    } catch (error) {
      console.error("Error updating logo:", error);
      toast.error("Failed to update logo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="bg-white shadow-lg rounded-lg p-6 my-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Image Field at Top */}
        <div>
          <label className="block font-medium text-primary mb-1">Logo Image</label>
          <div className="flex items-center gap-4">
            {logoData.image && (
              <img
                src={logoData.image}
                alt="Logo"
                className="w-16 h-16 object-cover rounded border"
              />
            )}
            <ImageUploader
              ref={uploaderRef}
              onUpload={(url) => setLogoData({ ...logoData, image: url })}
            />
          </div>
        </div>
        <div>
          <label className="block font-medium text-primary mb-1">Logo Content</label>
          <input
            type="text"
            value={logoData.content}
            onChange={(e) => setLogoData({ ...logoData, content: e.target.value })}
            placeholder="e.g., My Awesome Logo"
            className="modern-input"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-primary text-white rounded hover:bg-secondary transition"
        >
          {loading ? "Saving..." : "Save Logo"}
        </button>
      </form>
    </motion.div>
  );
};

export default LogoForm;
