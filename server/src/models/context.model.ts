import { model, Schema, Types, type InferSchemaType } from "mongoose";

const contextSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
  },
  {
    timestamps: true,
  },
);

export type ContextDocument = InferSchemaType<typeof contextSchema> & {
    _id: Types.ObjectId
}

export const contextModel = model("Context",contextSchema)