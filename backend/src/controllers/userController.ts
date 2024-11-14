import { Router } from "express";
import { getAllUsers, getUserById } from "../services/userService";
import { ObjectId } from 'mongodb';
import { authenticateToken } from "../util/middlewares";

const router = Router();

router.get("/users", authenticateToken, async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users", error: error });
  }
})

router.get("/user/:id", async (req, res) => {
  const userId = req.params.id;
  
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

export default router;
