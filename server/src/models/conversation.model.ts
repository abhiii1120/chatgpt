import { model, Schema,Types,type InferSchemaType } from "mongoose";

const conversationSchema = new Schema(
  {
    title: {
      required: true,
      trim: true,
      type: String,
      minlength: 3,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

export type ConversationDocument =  InferSchemaType<typeof conversationSchema> & {
    _id : Types.ObjectId
}

export const conversationModel = model("Conversation",conversationSchema);