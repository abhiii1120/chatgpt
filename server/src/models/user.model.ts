import { model, Schema, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    resetPasswordTokenHash: {
      type: String,
      default: null,
    },
    resetPasswordExpriesAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

//now using inferschematype we don't have to create another interface for user schema like this 
// {
//     name:string,
//     email:string,
//     passwordHash?:string,
// }
export type UserDocument = InferSchemaType<typeof userSchema> & {
  _id: string;
};

export const userModel = model("User",userSchema)