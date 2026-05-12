import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { auth } from "../auth-middleware.js";
import { UserModel } from "../models/user-model.js";
import { nanoid } from "nanoid";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send({ message: "Body must have username and password" });
  }

  // const existingUser = users.find((user) => user.username === username);
  const existingUser = await UserModel.findOne({ username: username });

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

  // const newUser = {
  //   id: nanoid(),
  //   username,
  //   password: hashedPassword,
  // };
  // users.push(newUser);
  // updateUserFile();
  const newUser = await UserModel.create({ _id: nanoid(), username, password: hashedPassword });
  return res.send(newUser);
});

router.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send({ message: "Body must have username and password" });
  }

  // const existingUser = users.find((user) => user.username === username);
  const existingUser = await UserModel.findOne({ username: username });

  if (!existingUser) {
    return res.status(401).send({ message: "Wrong credentials" });
  }

  const isMatching = bcrypt.compareSync(password, existingUser.password);

  if (!isMatching) {
    return res.status(401).send({ message: "Wrong credentials" });
  }
  const { password: hashedPassword, ...userWithoutPassword } = existingUser.toJSON();

  const accessToken = jwt.sign(userWithoutPassword, "MySecret", { expiresIn: "5m" });

  return res.send({ message: "Successfully signedin", accessToken });
});

router.get("/me", auth, (req, res) => {
  return res.send(req.user);
});

export default router;
