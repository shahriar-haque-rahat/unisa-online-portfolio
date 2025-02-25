"use client";

import { useState, useEffect, useRef } from "react";
import JsonEditor from "./tools/JsonEditor";
import ImageUploader from "./tools/ImageUploader";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const ProjectDataForm = () => {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    buttonLabel: "",
    imageSrc: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const uploaderRef = useRef(null);

  const fetchData = async () => {
    try {
      const data = await JsonEditor.getAll("projectData");
      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to fetch project data.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.imageSrc;
      if (formData.imageSrc && formData.imageSrc instanceof File) {
        imageUrl = await uploaderRef.current.uploadImage();
      }
      const dataToSubmit = { ...formData, imageSrc: imageUrl };

      if (editingId) {
        await JsonEditor.edit("projectData", editingId, dataToSubmit);
        toast.success("Project updated successfully!");
        setEditingId(null);
      } else {
        await JsonEditor.add("projectData", dataToSubmit);
        toast.success("Project added successfully!");
      }

      setFormData({ title: "", description: "", buttonLabel: "", imageSrc: null });
      fetchData();
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Failed to save project.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      title: item.title,
      description: item.description,
      buttonLabel: item.buttonLabel || "",
      imageSrc: item.imageSrc,
    });
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await JsonEditor.delete("projectData", id);
      toast.success("Project deleted successfully!");
      fetchData();
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project.");
    }
  };

  return (
    <motion.div
      className="bg-white shadow-lg rounded-lg p-6 my-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Project Data</h2>
      <p className="text-gray-500 mb-6">Manage your project entries here.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
        <input
          type="text"
          placeholder="Button Label"
          value={formData.buttonLabel}
          onChange={(e) => setFormData({ ...formData, buttonLabel: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        {/* Image */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Project Image</label>
          <div className="flex items-center gap-4">
            {formData.imageSrc && typeof formData.imageSrc === "string" && (
              <img
                src={formData.imageSrc}
                alt="Project"
                className="w-20 h-20 object-cover rounded border"
              />
            )}
            <ImageUploader
              ref={uploaderRef}
              onUpload={(file) => setFormData({ ...formData, imageSrc: file })}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {editingId ? "Update Project" : "Add Project"}
        </button>
      </form>

      <table className="w-full mt-6 border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="border p-2 text-gray-600">Title</th>
            <th className="border p-2 text-gray-600">Description</th>
            <th className="border p-2 text-gray-600">Button Label</th>
            <th className="border p-2 text-gray-600">Image</th>
            <th className="border p-2 text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((item) => (
            <tr key={item.id} className="text-center">
              <td className="border p-2">{item.title}</td>
              <td className="border p-2">{item.description}</td>
              <td className="border p-2">{item.buttonLabel}</td>
              <td className="border p-2">
                {item.imageSrc && (
                  <img src={item.imageSrc} alt="Project" className="w-16 h-16 mx-auto object-cover rounded" />
                )}
              </td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {projects.length === 0 && (
            <tr>
              <td colSpan={5} className="p-4 text-gray-500">
                No projects added.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </motion.div>
  );
};

export default ProjectDataForm;
