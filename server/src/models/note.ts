import { InferSchemaType, model, Schema } from "mongoose";

const noteModel = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, require: true },
    text: { type: String },
  },
  { timestamps: true }
);

type Note = InferSchemaType<typeof noteModel>;

export default model<Note>("Note", noteModel);
