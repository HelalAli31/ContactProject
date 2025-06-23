"use client";
import { useState } from "react";

export default function NewProjectModal({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState("");

  const handleAdd = async () => {
    if (!name.trim()) return;

    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    onSuccess?.();
    onClose();
    setName("");
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
      <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-6 space-y-4 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold text-blue-700">➕ New Project</h2>

        <input
          type="text"
          placeholder="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
