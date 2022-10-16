import mongoose from "mongoose";

const PostSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    image: { type: String },
    caption: {
      type: String,
      required: true,
    },
    upVotes: [],
    downVotes: [],
    comments: [],
  },
  {
    timestamps: true,
  }
);

const PostModel = mongoose.model("Posts", PostSchema);

export default PostModel;
