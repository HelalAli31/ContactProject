import dbConnect from "../dbConnect";
import Contact from "../models/Contact";

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  if (req.method === "GET") {
    const contact = await Contact.findById(id)
      .populate("subjectId")
      .populate("placeId");
    if (!contact) return res.status(404).json({ message: "Contact not found" });
    return res.status(200).json(contact);
  }

  if (req.method === "PUT") {
    const updated = await Contact.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.status(200).json(updated);
  }

  if (req.method === "DELETE") {
    await Contact.findByIdAndDelete(id);
    return res.status(204).end();
  }

  res.status(405).end();
}
