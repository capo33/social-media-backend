import { Schema, Document, Types, model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: string;
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      match: [/.+@.+\..+/, "Please enter a valid e-mail address"],
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "https://via.placeholder.com/150",
    },
    // has been added to the user model later
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
    ],
  },
  { timestamps: true }
);

const UserModel = model<IUser>("User", UserSchema);

export default UserModel;