"use client";
import { useEffect, useState } from "react";

export default function PickedTable({ projectId, refreshKey }) {
  const [grouped, setGrouped] = useState({});

  useEffect(() => {
    if (!projectId) return;
    fetch(`/api/pickedcontacts?projectId=${projectId}`)
      .then((res) => res.json())
      .then((data) => {
        const bySubject = {};
        data.forEach((item) => {
          const c = item.contactId;
          if (!c) return;
          const subject = c.subjectId?.name || "Unknown";
          if (!bySubject[subject]) bySubject[subject] = [];
          bySubject[subject].push({
            name: c.name,
            address: c.address,
            email: c.email,
            phone: c.phone,
            place: c.placeId?.name || "-",
          });
        });
        setGrouped(bySubject);
      });
  }, [projectId, refreshKey]);

  if (!projectId) return null;

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">
        📋 Picked Contacts by Subject
      </h2>

      {Object.keys(grouped).length === 0 ? (
        <p className="text-gray-600 italic">No picked contacts yet.</p>
      ) : (
        Object.entries(grouped).map(([subject, contacts]) => (
          <div key={subject} className="mb-8">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">
              📚 {subject}
            </h3>
            <div className="overflow-x-auto rounded-lg shadow">
              <table className="min-w-full text-sm text-gray-700 bg-white border border-gray-300">
                <thead className="bg-blue-100 text-blue-900">
                  <tr>
                    <th className="px-4 py-2 border">Name</th>
                    <th className="border px-3 py-2 text-left">Phone</th>
                    <th className="border px-3 py-2 text-left">Email</th>

                    <th className="px-4 py-2 border">Address</th>
                    <th className="px-4 py-2 border">Place</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((c, i) => (
                    <tr
                      key={i}
                      className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="px-4 py-2 border">{c.name}</td>
                      <td className="border px-3 py-2">{c.phone || "-"}</td>
                      <td className="border px-3 py-2">{c.email || "-"}</td>
                      <td className="px-4 py-2 border">{c.address}</td>
                      <td className="px-4 py-2 border">{c.place}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
