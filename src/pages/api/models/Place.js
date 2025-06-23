import mongoose from "mongoose";

const PlaceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

export default mongoose.models.Place || mongoose.model("Place", PlaceSchema);
