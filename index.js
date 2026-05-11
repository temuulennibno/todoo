import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import todoRouter from "./routers/todo-router.js";
import authRouter from "./routers/auth-router.js";
import { UserModel } from "./models/user-model.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/todos", todoRouter);
app.use("/api/auth", authRouter);

app.get("/api/users", async (req, res) => {
  const users = await UserModel.find();
  return res.send(users);
});

app.listen(5400, async () => {
  await mongoose.connect("mongodb+srv://temka:oyWCDtAftN0Rlus3@cluster0.j8b847d.mongodb.net/todo-app");
  console.log("Server is running on http://localhost:5400");
});
