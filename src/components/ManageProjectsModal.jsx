"use client";
import { useEffect, useState } from "react";

export default function ManageProjectsModal({ isOpen, onClose, onSuccess }) {
  const [projects, setProjects] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [name, setName] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    fetch("/api/projects")
      .then((res) => res.json())
      .then(setProjects);
  }, [isOpen]);

  useEffect(() => {
    const selected = projects.find((p) => p._id === selectedId);
    setName(selected?.name || "");
  }, [selectedId]);

  const handleSave = async () => {
    if (!name.trim()) return;
    const method = isAddingNew ? "POST" : "PUT";
    const url = isAddingNew ? "/api/projects" : `/api/projects/${selectedId}`;
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    onSuccess?.();
    onClose();
    setName("");
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    const confirmDelete = confirm("האם אתה בטוח שברצונך למחוק את הפרויקט?");
    if (!confirmDelete) return;

    await fetch(`/api/projects/${selectedId}`, {
      method: "DELETE",
    });
    onSuccess?.();
    onClose();
    setName("");
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md"
      dir="rtl"
    >
      <div className="bg-white border border-gray-100 rounded-3xl shadow-2xl p-8 space-y-6 relative font-sans">
        <button
          onClick={onClose}
          className="absolute top-3 left-4 text-gray-400 hover:text-gray-700 text-xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-indigo-700">
          📋 ניהול פרויקטים
        </h2>
        <h3>{isAddingNew ? "הוספת פרויקט חדש" : "עריכת פרויקט קיים"}</h3>

        {!isAddingNew && (
          <select
            className="w-full border px-4 py-2 rounded-lg"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            <option value="">-- בחר פרויקט --</option>
            {projects.map((proj) => (
              <option key={proj._id} value={proj._id}>
                {proj.name}
              </option>
            ))}
          </select>
        )}

        <input
          type="text"
          placeholder="שם הפרויקט"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg"
        />

        <div className="flex justify-between gap-4">
          <button
            className="text-sm text-blue-600 hover:underline"
            onClick={() => {
              setIsAddingNew((prev) => !prev);
              setSelectedId("");
              setName("");
            }}
          >
            {isAddingNew ? "🔙 חזרה לעריכה" : "➕ פרויקט חדש"}
          </button>

          <div className="flex gap-3">
            {!isAddingNew && selectedId && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                🗑️ מחק
              </button>
            )}
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {isAddingNew ? "הוסף" : "שמור"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
