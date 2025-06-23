"use client";
import { useEffect, useState } from "react";
import PickContacts from "@/components/PickContacts";
import PickedTable from "@/components/PickedTable";
import AddContactModal from "@/components/AddContactModal";
import EditContactsModal from "@/components/EditContactsModal";
import ManageProjectsModal from "@/components/ManageProjectsModal";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [showManageModal, setShowManageModal] = useState(false);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then(setProjects);
  }, []);

  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  const handleProjectSuccess = () => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then(setProjects);
    setShowProjectModal(false);
    setEditProject(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 to-indigo-100 text-gray-800 font-sans">
      <header className="bg-white shadow-md p-4 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold text-indigo-700 text-center w-full md:w-auto">
            📁 ניהול אנשי קשר
          </h1>

          <div className="flex gap-3 flex-wrap justify-center">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-100 hover:bg-blue-200 text-gray-800 px-4 py-2 rounded-xl shadow-md transition"
            >
              ➕ הוסף איש קשר
            </button>

            <button
              onClick={() => setShowManageModal(true)}
              className="bg-blue-100 hover:bg-blue-200 text-gray-800 px-4 py-2 rounded-xl shadow-md transition"
            >
              📋 ניהול פרויקטים
            </button>

            <button
              onClick={() => setShowEditModal(true)}
              className="bg-blue-100 hover:bg-blue-200 text-gray-800 px-4 py-2 rounded-xl shadow-md transition"
            >
              ✏️ ערוך אנשי קשר
            </button>
          </div>
        </div>
      </header>

      <ManageProjectsModal
        isOpen={showManageModal}
        onClose={() => setShowManageModal(false)}
        onSuccess={() => {
          setShowManageModal(false);
          fetch("/api/projects")
            .then((res) => res.json())
            .then(setProjects);
        }}
      />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <AddContactModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => alert("איש הקשר נוסף בהצלחה")}
        />

        <EditContactsModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
        />

        <div className="bg-white shadow-lg rounded-2xl p-6 mt-6">
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            בחר פרויקט:
          </label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="w-full p-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">-- בחר פרויקט --</option>
            {projects.map((proj) => (
              <option key={proj._id} value={proj._id}>
                {proj.name}
              </option>
            ))}
          </select>
        </div>

        {selectedProject && (
          <div className="space-y-10 mt-8">
            <PickedTable projectId={selectedProject} refreshKey={refreshKey} />
            <div className="border-t pt-6">
              <PickContacts
                projectId={selectedProject}
                onUpdate={handleRefresh}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
