import { Router } from "express";
import { getAllUsers, getUserByEmail, getUserById } from "../services/userService";
import { ObjectId } from 'mongodb';
import { verifyAdmin, verifyLoggedUser } from "../util/middlewares";

const router = Router();

router.get("/users", verifyAdmin, async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users", error: error });
  }
})

router.get("/user/:id", verifyLoggedUser, async (req, res) => {
  const userId = req.params.id;
  //@ts-ignore
  if (req.user.id !== userId) {
    res.status(401).send();
    return;
  }
  
  try {
    const user = await getUserById(new ObjectId(userId));
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  }
  catch (error) {
    res.status(500).json({ message: "Error retrieving user", error: error });
  }
});

router.get("/user/email/:email", async (req, res) => {
  const email = req.params.email;
  
  try {
    const user = await getUserByEmail(email);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  }
  catch (error) {
    res.status(500).json({ message: "Error retrieving user", error: error });
  }
});

export default router;
