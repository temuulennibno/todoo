import express from "express";
import fs from "fs";
import { nanoid } from "nanoid";

const app = express();
app.use(express.json());

const fileData = fs.readFileSync("./data.json", "utf-8");

let todos = JSON.parse(fileData);

const updateDataFile = () => {
  fs.writeFileSync("./data.json", JSON.stringify(todos), "utf-8");
};

app.get("/api/todos", (req, res) => {
  return res.send(todos);
});

app.post("/api/todos", (req, res) => {
  const name = req.body?.name;
  if (!name) {
    return res.status(400).send({ message: "Body must have name" });
  }
  const newTodo = {
    id: nanoid(),
    checked: false,
    name,
  };
  todos.push(newTodo);
  updateDataFile();
  return res.send(newTodo);
});

app.delete("/api/todos/:id", (req, res) => {
  const id = req.params.id; //string
  const deletingItem = todos.find((todo) => todo.id == id);
  if (!deletingItem) {
    return res.status(404).send({ message: "Todo not found" });
  }
  todos = todos.filter((todo) => todo.id != id);
  updateDataFile();
  return res.send(deletingItem);
});

app.put("/api/todos/:id", (req, res) => {
  const id = req.params.id;
  const updatingItem = todos.find((todo) => todo.id == id);
  if (!updatingItem) {
    return res.status(404).send({ message: "Todo not found" });
  }
  const { name, checked } = req.body;
  console.log({ name, checked });
  console.log(!name);
  console.log(checked === undefined);
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
  updateDataFile();
  return res.send(updatedTodo);
});

app.get("/api/todos/:id", (req, res) => {
  const id = req.params.id; //string
  const item = todos.find((todo) => todo.id == id);
  if (!item) {
    return res.status(404).send({ message: "Todo not found" });
  }
  return res.send(item);
});

app.listen(5400, () => {
  console.log("Server is running on http://localhost:5400");
});
