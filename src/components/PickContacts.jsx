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
    const confirmed =
      picked.length === 0
        ? confirm("אתה בטוח שברצונך להסיר את כל אנשי הקשר מהפרויקט?")
        : true;

    if (!confirmed) return;

    await fetch("/api/pickedcontacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contactIds: picked, projectId }),
    });

    if (onUpdate) onUpdate();
  };

  if (!projectId) return null;

  return (
    <div
      className="p-6 bg-gradient-to-b from-white to-blue-50 rounded-3xl shadow-lg mt-6 border border-blue-200"
      dir="rtl"
    >
      <h2 className="text-3xl font-extrabold text-blue-800 mb-6">
        🎯 בחירת אנשי קשר לפרויקט
      </h2>

      <div className="flex gap-6 mb-6 flex-wrap">
        <select
          className="border border-blue-300 bg-white px-4 py-2 rounded-xl shadow focus:ring-2 focus:ring-blue-400"
          value={selectedSubject}
          onChange={(e) => {
            setSelectedSubject(e.target.value);
            setSelectedPlace("");
          }}
        >
          <option value="">כל הנושאים</option>
          {subjects.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          className="border border-blue-300 bg-white px-4 py-2 rounded-xl shadow focus:ring-2 focus:ring-blue-400"
          value={selectedPlace}
          onChange={(e) => setSelectedPlace(e.target.value)}
        >
          <option value="">כל המקומות</option>
          {places.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="max-h-80 overflow-y-auto grid gap-4 mb-6 pr-1">
        {filteredContacts.map((c) => (
          <label
            key={c._id}
            className="flex items-center gap-4 bg-white px-5 py-3 rounded-xl border border-blue-200 shadow hover:bg-blue-100 transition"
          >
            <input
              type="checkbox"
              checked={picked.includes(c._id)}
              onChange={() => toggleContact(c._id)}
              className="w-5 h-5 accent-blue-600 checkbox"
            />
            <span className="text-gray-800">
              <strong className="text-blue-700">{c.name}</strong> —{" "}
              {c.placeId?.name} — {c.subjectId?.name}
            </span>
          </label>
        ))}
      </div>

      <button
        onClick={handleSave}
        className={`px-6 py-3 text-lg font-semibold rounded-full shadow transition-all ${
          picked.length > 0
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-300 text-gray-600 cursor-pointer"
        }`}
      >
        {picked.length > 0
          ? `✅ שמור ${picked.length} אנשי קשר לפרויקט`
          : "🗑️ הסר את כל אנשי הקשר מהפרויקט"}
      </button>
    </div>
  );
}
