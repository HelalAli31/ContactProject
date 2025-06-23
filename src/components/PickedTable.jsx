"use client";
import { useEffect, useState } from "react";

export default function PickedTable({ projectId, refreshKey }) {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    if (!projectId) return;
    fetch(`/api/pickedcontacts?projectId=${projectId}`)
      .then((res) => res.json())
      .then((data) => {
        const flatContacts = data
          .filter((item) => item.contactId)
          .map((item) => {
            const c = item.contactId;
            return {
              name: c.name,
              phone: c.phone || "-",
              email: c.email || "-",
              address: c.address,
              place: c.placeId?.name || "-",
              subject: c.subjectId?.name || "לא ידוע",
            };
          });
        setContacts(flatContacts);
      });
  }, [projectId, refreshKey]);

  if (!projectId) return null;

  return (
    <div
      className="p-6 bg-gradient-to-b from-white to-blue-50 rounded-3xl shadow-xl border border-blue-200"
      dir="rtl"
    >
      <h2 className="text-3xl font-extrabold text-blue-800 mb-6">
        📋 אנשי קשר שנבחרו
      </h2>

      {contacts.length === 0 ? (
        <p className="text-gray-600 italic">לא נבחרו אנשי קשר עדיין.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow">
          <table className="min-w-full text-sm text-gray-700 bg-white border border-gray-300 rounded-xl">
            <thead className="bg-blue-100 text-blue-900">
              <tr>
                <th className="px-6 py-3 border">שם</th>
                <th className="px-6 py-3 border">טלפון</th>
                <th className="px-6 py-3 border">אימייל</th>
                <th className="px-6 py-3 border">כתובת</th>
                <th className="px-6 py-3 border">מקום</th>
                <th className="px-6 py-3 border">נושא</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="px-6 py-3 border font-semibold text-blue-800">
                    {c.name}
                  </td>
                  <td className="px-6 py-3 border">{c.phone}</td>
                  <td className="px-6 py-3 border">{c.email}</td>
                  <td className="px-6 py-3 border">{c.address}</td>
                  <td className="px-6 py-3 border">{c.place}</td>
                  <td className="px-6 py-3 border font-semibold text-blue-800">
                    {c.subject}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
