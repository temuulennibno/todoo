import express from "express";
import fs from "fs";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { auth } from "../auth-middleware.js";

const userData = fs.readFileSync("./users.json", "utf-8");
let users = JSON.parse(userData);

const updateUserFile = () => {
  fs.writeFileSync("./users.json", JSON.stringify(users), "utf-8");
};

const router = express.Router();

router.post("/signup", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send({ message: "Body must have username and password" });
  }

  const existingUser = users.find((user) => user.username === username);

  if (existingUser) {
    return res.status(400).send({ message: "Username already exists" });
  }

  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/;
  if (!regex.test(password)) {
    return res.status(400).send({
      message: `
Password must contain:
- At least 8 characters
- One uppercase letter
- One lowercase letter
- One number
- One special character
    `,
    });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = {
    id: nanoid(),
    username,
    password: hashedPassword,
  };
  users.push(newUser);
  updateUserFile();
  return res.send(newUser);
});

router.post("/signin", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send({ message: "Body must have username and password" });
  }

  const existingUser = users.find((user) => user.username === username);

  if (!existingUser) {
    return res.status(401).send({ message: "Wrong credentials" });
  }

  const isMatching = bcrypt.compareSync(password, existingUser.password);

  if (!isMatching) {
    return res.status(401).send({ message: "Wrong credentials" });
  }
  const { password: hashedPassword, ...userWithoutPassword } = existingUser;

  const accessToken = jwt.sign(userWithoutPassword, "MySecret", { expiresIn: "5m" });

  return res.send({ message: "Successfully signedin", accessToken });
});

router.get("/me", auth, (req, res) => {
  return res.send(req.user);
});

export default router;
