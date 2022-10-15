import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";

// Importing routes
import auth from "./routes/auth.js";
import user from "./routes/user.js";

const app = express();

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
      console.log("Running!");
    });
  })
  .catch((err) => {
    console.error(err);
  });

/* App Routes
============= */
app.use("/auth", auth);
app.use("/user", user);
