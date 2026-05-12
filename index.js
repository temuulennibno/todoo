import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import todoRouter from "./routers/todo-router.js";
import authRouter from "./routers/auth-router.js";
import { UserModel } from "./models/user-model.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/todos", todoRouter);
app.use("/api/auth", authRouter);

app.get("/api/users", async (req, res) => {
  const users = await UserModel.find();
  return res.send(users);
});

app.listen(PORT, async () => {
  await mongoose.connect(process.env.DATABASE_URL);
  console.log("Server is running on http://localhost:" + PORT);
});
