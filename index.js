import express from "express";
import fs from "fs";

import todoRouter from "./routers/todo-router.js";
import authRouter from "./routers/auth-router.js";

const app = express();
app.use(express.json());

app.use("/api/todos", todoRouter);
app.use("/api/auth", authRouter);

const userData = fs.readFileSync("./users.json", "utf-8");

let users = JSON.parse(userData);

app.get("/api/users", (req, res) => {
  return res.send(users);
});

app.listen(5400, () => {
  console.log("Server is running on http://localhost:5400");
});
