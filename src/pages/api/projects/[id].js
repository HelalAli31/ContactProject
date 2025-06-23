import dbConnect from "../dbConnect";
import Project from "../models/Project";

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  if (req.method === "PUT") {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    const updated = await Project.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Project not found" });

    return res.status(200).json(updated);
  }

  if (req.method === "DELETE") {
    const deleted = await Project.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Project not found" });

    return res.status(200).json({ message: "Project deleted" });
  }

  res.setHeader("Allow", ["PUT", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
