import dbConnect from "../dbConnect.js";
import PickedContact from "../models/PickedContact.js";
import "../models/Contact.js";
import "../models/Subject.js";
import "../models/Place.js";

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === "GET") {
    const { projectId } = req.query;
    console.log(projectId);

    const filter = projectId ? { projectId } : {};
    const picked = await PickedContact.find(filter).populate({
      path: "contactId",
      populate: ["subjectId", "placeId"],
    });
    return res.status(200).json(picked);
  }

  if (req.method === "POST") {
    const { contactIds, projectId } = req.body;
    console.log(projectId);

    await PickedContact.deleteMany({ projectId });
    await Promise.all(
      contactIds.map((id) => PickedContact.create({ contactId: id, projectId }))
    );

    return res.status(201).json({ message: "Contacts saved to project" });
  }
}
