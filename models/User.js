import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
    },
    coverPicture: {
      type: String,
    },
    followers: [],
    following: [],
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("Users", UserSchema);

export default UserModel;
