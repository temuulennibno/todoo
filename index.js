import express from "express";
import fs from "fs";
import { nanoid } from "nanoid";

import todoRouter from "./routers/todo-router.js";

const app = express();
app.use(express.json());

app.use("/api/todos", todoRouter);

const userData = fs.readFileSync("./users.json", "utf-8");

let users = JSON.parse(userData);

const updateUserFile = () => {
  fs.writeFileSync("./users.json", JSON.stringify(users), "utf-8");
};

app.get("/api/users", (req, res) => {
  return res.send(users);
});

app.post("/api/users", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send({ message: "Body must have username and password" });
  }

  const existingUser = users.find((user) => user.username === username);

  if (existingUser) {
    return res.status(400).send({ message: "Username already exists" });
  }

  // 1. dood tal ni 8 temdegt
  // 2. too
  // 3. tom jijig useg
  // 4. tusgai temdegt

  const newUser = {
    id: nanoid(),
    username,
    password,
  };
  users.push(newUser);
  updateUserFile();
  return res.send(newUser);
});

app.listen(5400, () => {
  console.log("Server is running on http://localhost:5400");
});
