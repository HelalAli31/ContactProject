import dbConnect from "../dbConnect";
import Place from "../models/Place";
export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const places = await Place.find();
    return res.status(200).json(places);
  }

  if (req.method === "POST") {
    const place = await Place.create(req.body);
    return res.status(201).json(place);
  }

  res.status(405).end();
}
