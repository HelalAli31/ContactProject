"use client";
import { useEffect, useState } from "react";

export default function EditContactsModal({ isOpen, onClose }) {
  const [contacts, setContacts] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [places, setPlaces] = useState([]);
  const [filterSubject, setFilterSubject] = useState("");
  const [filterPlace, setFilterPlace] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    fetch("/api/contacts")
      .then((res) => res.json())
      .then(setContacts);
    fetch("/api/subjects")
      .then((res) => res.json())
      .then(setSubjects);
    fetch("/api/places")
      .then((res) => res.json())
      .then(setPlaces);
  }, [isOpen]);

  const handleUpdate = async (contact) => {
    const res = await fetch(`/api/contacts/${contact._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contact),
    });
    setMessage(res.ok ? "✅ איש קשר עודכן בהצלחה" : "❌ העדכון נכשל");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm("האם אתה בטוח שברצונך למחוק את איש הקשר?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/contacts/${id}`, { method: "DELETE" });
    if (res.ok) {
      setContacts((prev) => prev.filter((c) => c._id !== id));
      setMessage("🗑️ איש הקשר נמחק בהצלחה");
    } else {
      setMessage("❌ המחיקה נכשלה");
    }
    setTimeout(() => setMessage(""), 3000);
  };

  const updateContactField = (id, field, value) => {
    setContacts((prev) =>
      prev.map((c) => (c._id === id ? { ...c, [field]: value } : c))
    );
  };

  const filtered = contacts.filter((c) => {
    return (
      (!filterSubject || c.subjectId?._id === filterSubject) &&
      (!filterPlace || c.placeId?._id === filterPlace)
    );
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center pt-10" dir="rtl">
      <div className="absolute inset-0 black backdrop-blur-sm z-40"></div>

      <div className="bg-white p-8 rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-auto relative z-50 shadow-2xl font-sans border border-gray-200">
        <button
          onClick={onClose}
          className="absolute top-4 left-5 text-xl text-gray-400 hover:text-gray-800"
        >
          &times;
        </button>

        <h2 className="text-3xl font-bold text-[#2c3e50] mb-6 tracking-tight">
          🛠 ניהול אנשי קשר
        </h2>

        {message && (
          <div className="mb-4 p-3 rounded-lg text-white bg-green-500 text-center text-sm">
            {message}
          </div>
        )}

        <div className="flex gap-5 mb-6">
          <div className="w-full">
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg shadow-sm text-gray-700 text-sm"
            >
              <option value="">כל הנושאים</option>
              {subjects.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full">
            <select
              value={filterPlace}
              onChange={(e) => setFilterPlace(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg shadow-sm text-gray-700 text-sm"
            >
              <option value="">כל המקומות</option>
              {places.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right border-collapse">
            <thead className="bg-[#e8f0fe] text-[#2c3e50]">
              <tr>
                <th className="px-4 py-2 border-b font-medium">שם</th>
                <th className="px-4 py-2 border-b font-medium">אימייל</th>
                <th className="px-4 py-2 border-b font-medium">טלפון</th>
                <th className="px-4 py-2 border-b font-medium">כתובת</th>
                <th className="px-4 py-2 border-b font-medium">נושא</th>
                <th className="px-4 py-2 border-b font-medium">מקום</th>
                <th className="px-4 py-2 border-b font-medium text-center">
                  פעולות
                </th>
              </tr>
            </thead>
            <tbody className="overflow-scroll">
              {filtered.map((c) => (
                <tr key={c._id} className="odd:bg-white even:bg-gray-50">
                  <td className="px-3 py-2">
                    <input
                      value={c.name || ""}
                      onChange={(e) =>
                        updateContactField(c._id, "name", e.target.value)
                      }
                      className="w-full border rounded px-2 py-1 text-sm"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      value={c.email || ""}
                      onChange={(e) =>
                        updateContactField(c._id, "email", e.target.value)
                      }
                      className="w-full border rounded px-2 py-1 text-sm"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      value={c.phone || ""}
                      onChange={(e) =>
                        updateContactField(c._id, "phone", e.target.value)
                      }
                      className="w-full border rounded px-2 py-1 text-sm"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      value={c.address || ""}
                      onChange={(e) =>
                        updateContactField(c._id, "address", e.target.value)
                      }
                      className="w-full border rounded px-2 py-1 text-sm"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={
                        typeof c.subjectId === "object"
                          ? c.subjectId._id
                          : c.subjectId
                      }
                      onChange={(e) =>
                        updateContactField(c._id, "subjectId", e.target.value)
                      }
                      className="border border-black rounded-md px-4 py-[7px] text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    >
                      <option value="">-- בחר --</option>
                      {subjects.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-3 py-2">
                    <select
                      value={
                        typeof c.placeId === "object"
                          ? c.placeId._id
                          : c.placeId
                      }
                      onChange={(e) =>
                        updateContactField(c._id, "placeId", e.target.value)
                      }
                      className="border border-black rounded-md px-4 py-[7px] text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    >
                      <option value="">-- בחר --</option>
                      {places.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-3 py-2 text-center flex justify-center gap-2">
                    <button
                      onClick={() => handleUpdate(c)}
                      className="text-green-600 hover:scale-110 transition"
                    >
                      💾
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="text-red-600 hover:scale-110 transition"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
