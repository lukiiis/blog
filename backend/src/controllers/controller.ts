import { Router, Request, Response } from "express";
import { getAllUsers, getUserById } from "../services/userService";

const router = Router();

router.get("/users", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users", error });
  }
})

router.get("/user/:id", async (req: Request, res: Response) => {
  const userId = req.params.id;
  
  try {
    const user = await getUserById(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  }
  catch (error) {
    res.status(500).json({ message: "Error retrieving user", error });
  }
});

export default router;