import dbConnect from "../dbConnect";
import Project from "../models/Project";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const projects = await Project.find();
    return res.status(200).json(projects);
  }

  if (req.method === "POST") {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    const newProject = await Project.create({ name });
    return res.status(201).json(newProject);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
