import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema(
  {
    _id: { type: String },
    name: { type: String, required: true },
    checked: { type: Boolean, required: true, default: false },
    userId: { type: String, required: true },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

TodoSchema.virtual("user", {
  localField: "userId",
  foreignField: "_id",
  ref: "userss",
  justOne: true,
});

export const TodoModel = mongoose.model("todoss", TodoSchema);
