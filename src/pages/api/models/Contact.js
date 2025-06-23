// models/Contact.js
import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
  name: String,
  address: String,
  email: String,
  phone: String,
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
  placeId: { type: mongoose.Schema.Types.ObjectId, ref: "Place" },
});

export default mongoose.models.Contact ||
  mongoose.model("Contact", ContactSchema);
