import { Schema, Document, Types, model } from "mongoose";

export interface IPost extends Document {
  title: string;
  body: string;
  image: string;
  likes: Types.ObjectId[];
  comments: [
    {
      comment: string;
      postedBy: Types.ObjectId;
    }
  ];
  postedBy: Types.ObjectId;
}

const PostSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
      default: "no photo",
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        comment: {
          type: String,
        },
        postedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const PostModel = model<IPost>("Post", PostSchema);

export default PostModel;
