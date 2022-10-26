import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";

// Importing routes
import auth from "./routes/auth.js";
import user from "./routes/user.js";
import post from "./routes/post.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

dotenv.config();

mongoose
  .connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT, (req, res) => {
      console.log(`RUNNING ON PORT: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });

/* App Routes
============= */
app.use("/auth", auth);
app.use("/user", user);
app.use("/post", post);
