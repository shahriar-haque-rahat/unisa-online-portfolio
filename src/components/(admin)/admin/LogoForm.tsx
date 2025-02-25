"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ImageUploader from "./tools/ImageUploader";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const LogoForm = () => {
  // Our data structure is: { image: string | File, content: string }
  const [logoData, setLogoData] = useState({ image: "", content: "" });
  const uploaderRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // Fetch the current logo from /api/data/logo
  const fetchLogo = async () => {
    try {
      const res = await axios.get("/api/data/logo");
      // Expecting something like { image: "/path/to/logo.jpg", content: "Some text" }
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

  // On submit, upload the file if it's a File, then send final data to the server
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImage = logoData.image;
      if (finalImage && finalImage instanceof File) {
        const uploadedUrl = await uploaderRef.current.uploadImage();
        finalImage = uploadedUrl;
      }

      const payload = {
        image: finalImage,
        content: logoData.content,
      };

      await axios.post("/api/data/logo", payload);
      toast.success("Logo updated successfully!");
      fetchLogo(); // Refresh local state if needed
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
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Logo</h2>
      <p className="text-gray-500 mb-6">
        Update your site logo image and additional content here.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* IMAGE FIELD */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Logo Image</label>
          <div className="flex items-center gap-4">
            {logoData.image && typeof logoData.image === "string" && (
              <img
                src={logoData.image}
                alt="Logo"
                className="w-16 h-16 object-cover rounded-md border"
              />
            )}
            <ImageUploader
              ref={uploaderRef}
              onUpload={(file) => setLogoData({ ...logoData, image: file })}
            />
          </div>
        </div>

        {/* CONTENT FIELD */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Logo Content</label>
          <input
            type="text"
            value={logoData.content}
            onChange={(e) =>
              setLogoData({ ...logoData, content: e.target.value })
            }
            placeholder="e.g., My Awesome Logo"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {loading ? "Saving..." : "Save Logo"}
        </button>
      </form>
    </motion.div>
  );
};

export default LogoForm;
