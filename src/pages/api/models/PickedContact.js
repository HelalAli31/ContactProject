import mongoose from "mongoose";

const pickedContactSchema = new mongoose.Schema({
  contactId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contact",
    required: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
});

export default mongoose.models.PickedContact ||
  mongoose.model("PickedContact", pickedContactSchema);
