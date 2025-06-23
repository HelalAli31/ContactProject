"use client";
import { useEffect, useState } from "react";
import PickContacts from "@/components/PickContacts";
import PickedTable from "@/components/PickedTable";
import AddContactModal from "@/components/AddContactModal";
import NewProjectModal from "@/components/NewProjectModal";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then(setProjects);
  }, []);

  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 text-gray-800 p-6 font-sans">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <AddContactModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            // Optional: refresh contacts list if needed
            alert("Contact added successfully");
          }}
        />
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            ➕ Add New Contact
          </button>

          <button
            onClick={() => setShowProjectModal(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded"
          >
            📁 New Project
          </button>
        </div>

        <NewProjectModal
          isOpen={showProjectModal}
          onClose={() => setShowProjectModal(false)}
          onSuccess={() => {
            setShowProjectModal(false);
            // Refresh the projects list
            fetch("/api/projects")
              .then((res) => res.json())
              .then(setProjects);
          }}
        />

        <h1 className="text-4xl font-extrabold text-blue-700 mb-6 tracking-tight">
          📁 Contact Projects Manager
        </h1>

        <div className="mb-8">
          <label className="text-lg font-medium text-gray-700 mr-3">
            Select a project:
          </label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-4 py-2 border border-blue-400 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            <option value="">-- Select a project --</option>
            {projects.map((proj) => (
              <option key={proj._id} value={proj._id}>
                {proj.name}
              </option>
            ))}
          </select>
        </div>

        {selectedProject && (
          <div className="space-y-10">
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
