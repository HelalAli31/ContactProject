"use client";
import { useEffect, useState } from "react";

export default function PickContacts({ projectId, onUpdate }) {
  const [subjects, setSubjects] = useState([]);
  const [places, setPlaces] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedPlace, setSelectedPlace] = useState("");
  const [picked, setPicked] = useState([]);

  useEffect(() => {
    fetch("/api/subjects")
      .then((res) => res.json())
      .then(setSubjects);
  }, []);

  useEffect(() => {
    if (!projectId) return;
    fetch(`/api/pickedcontacts?projectId=${projectId}`)
      .then((res) => res.json())
      .then((data) => {
        const ids = data.map((item) => item.contactId?._id).filter(Boolean);
        setPicked(ids);
      });
  }, [projectId]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (!projectId) return;
      const url = selectedSubject
        ? `/api/contacts?subjectId=${selectedSubject}`
        : `/api/contacts`;
      const res = await fetch(url);
      const data = await res.json();
      setContacts(data);

      const uniquePlaces = [];
      const seen = new Set();
      data.forEach((c) => {
        if (c.placeId && !seen.has(c.placeId._id)) {
          seen.add(c.placeId._id);
          uniquePlaces.push(c.placeId);
        }
      });
      setPlaces(uniquePlaces);

      setFilteredContacts(
        selectedPlace
          ? data.filter((c) => c.placeId?._id === selectedPlace)
          : data
      );
    };

    fetchContacts();
  }, [selectedSubject, projectId]);

  useEffect(() => {
    setFilteredContacts(
      selectedPlace
        ? contacts.filter((c) => c.placeId?._id === selectedPlace)
        : contacts
    );
  }, [selectedPlace, contacts]);

  const toggleContact = (id) => {
    setPicked((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    const res = await fetch("/api/pickedcontacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contactIds: picked, projectId }),
    });
    const result = await res.json();
    if (onUpdate) onUpdate();
  };

  if (!projectId) return null;

  return (
    <div className="p-6 bg-white rounded-xl shadow-md mt-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">
        🎯 Pick Contacts for This Project
      </h2>

      <div className="flex gap-4 mb-6">
        <select
          className="border border-blue-300 bg-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
          value={selectedSubject}
          onChange={(e) => {
            setSelectedSubject(e.target.value);
            setSelectedPlace("");
          }}
        >
          <option value="">All Subjects</option>
          {subjects.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          className="border border-blue-300 bg-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
          value={selectedPlace}
          onChange={(e) => setSelectedPlace(e.target.value)}
        >
          <option value="">All Places</option>
          {places.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-3 mb-6">
        {filteredContacts.map((c) => (
          <label
            key={c._id}
            className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-lg shadow-sm hover:bg-blue-100 transition-all"
          >
            <input
              type="checkbox"
              checked={picked.includes(c._id)}
              onChange={() => toggleContact(c._id)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-gray-800">
              <strong>{c.name}</strong> — {c.placeId?.name} —{" "}
              {c.subjectId?.name}
            </span>
          </label>
        ))}
      </div>

      {picked.length > 0 && (
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all"
        >
          ✅ Save Project with {picked.length} Contacts
        </button>
      )}
    </div>
  );
}
