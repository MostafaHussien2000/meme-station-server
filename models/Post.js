import mongoose from "mongoose";

const PostSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    image: String,
    caption: {
      type: String,
      required: true,
    },
    likes: [],
    comments: [],
  },
  {
    timestamps: true,
  }
);

const PostModel = mongoose.model("Posts", PostSchema);

export default PostModel;
