import dbConnect from "./dbConnect";
import Subject from "./models/Subject.js";
import Place from "./models/Place.js";
import Contact from "./models/Contact.js";
import Project from "./models/Project.js";
import PickedContact from "./models/PickedContact.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Only POST allowed");

  await dbConnect();

  try {
    // Clean previous data
    await Subject.deleteMany();
    await Place.deleteMany();
    await Contact.deleteMany();
    await Project.deleteMany();
    await PickedContact.deleteMany();

    // Seed subjects
    const subjects = await Subject.insertMany([
      { name: "Technology" },
      { name: "Education" },
      { name: "Health" },
    ]);

    // Seed places
    const places = await Place.insertMany([
      { name: "New York" },
      { name: "Tel Aviv" },
      { name: "Berlin" },
    ]);

    // Seed contacts
    const contacts = await Contact.insertMany([
      {
        name: "Alice Smith",
        address: "123 Main St",
        subjectId: subjects[0]._id,
        placeId: places[0]._id,
      },
      {
        name: "Bob Johnson",
        address: "456 Rothschild Blvd",
        subjectId: subjects[1]._id,
        placeId: places[1]._id,
      },
      {
        name: "Clara Müller",
        address: "789 Ringstrasse",
        subjectId: subjects[2]._id,
        placeId: places[2]._id,
      },
      {
        name: "David Cohen",
        address: "22 Dizengoff St",
        subjectId: subjects[0]._id,
        placeId: places[1]._id,
      },
      {
        name: "Emily Wang",
        address: "88 Broadway",
        subjectId: subjects[2]._id,
        placeId: places[0]._id,
      },
    ]);

    // Seed projects
    const projects = await Project.insertMany([
      { name: "Project Alpha" },
      { name: "Project Beta" },
    ]);

    // Assign picked contacts to projects
    await PickedContact.insertMany([
      { projectId: projects[0]._id, contactId: contacts[0]._id },
      { projectId: projects[0]._id, contactId: contacts[1]._id },
      { projectId: projects[1]._id, contactId: contacts[2]._id },
      { projectId: projects[1]._id, contactId: contacts[3]._id },
    ]);

    res.status(200).json({
      message: "✅ Seeded data successfully",
      contacts: contacts.length,
      subjects: subjects.length,
      places: places.length,
      projects: projects.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "❌ Seeding failed", details: err.message });
  }
}
