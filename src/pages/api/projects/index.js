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
    const newProject = await Project.create({ name });
    return res.status(201).json(newProject);
  }

  res.status(405).end();
}
