import dbConnect from "../dbConnect.js";
import Contact from "../models/Contact.js";
import "../models/Place.js";
import "../models/Subject.js";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const { subjectId, placeId } = req.query;

    const query = {};
    if (subjectId) query.subjectId = subjectId;
    if (placeId) query.placeId = placeId;

    const contacts = await Contact.find(query)
      .populate("subjectId")
      .populate("placeId");

    return res.status(200).json(contacts);
  }

  if (req.method === "POST") {
    const contact = await Contact.create(req.body);
    console.log(contact);
    return res.status(201).json(contact);
  }

  res.status(405).end();
}
