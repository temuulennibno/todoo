import express from "express";
import fs from "fs";
import { nanoid } from "nanoid";
import { auth } from "../auth-middleware.js";

const userData = fs.readFileSync("./users.json", "utf-8");
let users = JSON.parse(userData);

const router = express.Router();

const todoData = fs.readFileSync("./data.json", "utf-8");
let todos = JSON.parse(todoData);

const updateTodoFile = () => {
  fs.writeFileSync("./data.json", JSON.stringify(todos), "utf-8");
};

router.get("/", auth, (req, res) => {
  const userTodos = todos.filter((todo) => todo.userId === req.user.id);

  return res.send(userTodos);
});

router.post("/", auth, (req, res) => {
  const name = req.body?.name;
  if (!name) {
    return res.status(400).send({ message: "Body must have name" });
  }
  const newTodo = {
    id: nanoid(),
    checked: false,
    userId: req.user.id,
    name,
  };
  todos.push(newTodo);
  updateTodoFile();
  return res.send(newTodo);
});

router.delete("/:id", auth, (req, res) => {
  const id = req.params.id;
  const user = req.user;

  const deletingItem = todos.find((todo) => todo.id == id);
  if (!deletingItem) {
    return res.status(404).send({ message: "Todo not found" });
  }
  if (user.id !== deletingItem.userId) {
    return res.status(403).send({ message: "Forbidden" });
  }

  todos = todos.filter((todo) => todo.id != id);
  updateTodoFile();
  return res.send(deletingItem);
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const updatingItem = todos.find((todo) => todo.id == id);
  if (!updatingItem) {
    return res.status(404).send({ message: "Todo not found" });
  }
  const { name, checked } = req.body;
  if (!name || checked !== undefined) {
    return res.status(400).send({ message: "Body must have atleast name or checked" });
  }
  const updatedTodo = {
    ...updatingItem,
    ...(name && { name }),
    ...(checked !== undefined && { checked }),
  };
  todos = todos.map((todo) => {
    if (todo.id == id) {
      return updatedTodo;
    }
    return todo;
  });
  updateTodoFile();
  return res.send(updatedTodo);
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  const item = todos.find((todo) => todo.id == id);
  if (!item) {
    return res.status(404).send({ message: "Todo not found" });
  }
  return res.send(item);
});

export default router;
