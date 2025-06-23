"use client";
import { useState, useEffect } from "react";

export default function AddContactModal({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [subject, setSubject] = useState("");
  const [place, setPlace] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [places, setPlaces] = useState([]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    fetch("/api/subjects")
      .then((res) => res.json())
      .then(setSubjects);

    fetch("/api/places")
      .then((res) => res.json())
      .then(setPlaces);
  }, [isOpen]);

  const handleAdd = async () => {
    const existingSubject = subjects.find((s) => s.name === subject);
    const subjectRes = existingSubject
      ? existingSubject
      : await fetch("/api/subjects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: subject }),
        }).then((r) => r.json());

    const existingPlace = places.find((p) => p.name === place);
    const placeRes = existingPlace
      ? existingPlace
      : await fetch("/api/places", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: place }),
        }).then((r) => r.json());

    await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        phone,
        address,
        subjectId: subjectRes._id,
        placeId: placeRes._id,
      }),
    });

    onSuccess?.();
    onClose();
    setName("");
    setAddress("");
    setSubject("");
    setPlace("");
    setEmail("");
    setPhone("");
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
      <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-6 space-y-4 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold text-blue-700 flex items-center gap-2">
          ➕ Add New Contact
        </h2>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          list="subject-options"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Select or enter subject"
          className="w-full border px-3 py-2 rounded"
        />
        <datalist id="subject-options">
          {subjects.map((s) => (
            <option key={s._id} value={s.name} />
          ))}
        </datalist>

        <input
          list="place-options"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          placeholder="Select or enter place"
          className="w-full border px-3 py-2 rounded"
        />
        <datalist id="place-options">
          {places.map((p) => (
            <option key={p._id} value={p.name} />
          ))}
        </datalist>

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
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
