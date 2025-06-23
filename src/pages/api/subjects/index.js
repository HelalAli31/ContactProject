import dbConnect from "../dbConnect";
import Subject from "../models/Subject";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const subjects = await Subject.find();
    return res.status(200).json(subjects);
  }

  if (req.method === "POST") {
    const subject = await Subject.create(req.body);
    return res.status(201).json(subject);
  }

  res.status(405).end();
}
