import { Router } from "express";
import { deleteUser, getAllUsers, getUserByEmail, getUserById, updateUser, blockUser, unblockUser, changeUserPassword, changeUserRole } from "../services/userService";
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

router.get("/user/email/:email", verifyAdmin, async (req, res) => {
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

router.put("/user/:id", verifyLoggedUser, async (req, res) => {
  const userId = req.params.id;
  // @ts-ignore
  if (req.user.id !== userId) {
    res.status(401).send();
    return;
  }
  
  try {
    const updatedUser = await updateUser(new ObjectId(userId), req.body);
    
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
});

router.delete("/user/:id", verifyLoggedUser, async (req, res) => {
  const userId = req.params.id;
  //@ts-ignore
  if (req.user.id !== userId && !req.user.isAdmin) {
    res.status(401);
    return;
  }
  
  try {
    const success = await deleteUser(new ObjectId(userId));
    if (success) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    // @ts-ignore
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
});

router.put("/user/:id/block", verifyAdmin, async (req, res) => {
  const userId = req.params.id;

  try {
    const blockedUser = await blockUser(new ObjectId(userId));
    if (blockedUser) {
      res.json(blockedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error blocking user", error });
  }
});

router.put("/user/:id/unblock", verifyAdmin, async (req, res) => {
  const userId = req.params.id;

  try {
    const unblockedUser = await unblockUser(new ObjectId(userId));
    if (unblockedUser) {
      res.json(unblockedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error unblocking user", error });
  }
});

router.put("/user/:id/password", verifyAdmin, async (req, res) => {
  const userId = req.params.id;
  const { password } = req.body;

  console.log(password)
  try {
    const updatedUser = await changeUserPassword(new ObjectId(userId), password);
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error changing user password", error });
  }
});


router.put("/user/:id/role", verifyAdmin, async (req, res) => {
  const userId = req.params.id;
  const { isAdmin } = req.body;

  try {
    const updatedUser = await changeUserRole(new ObjectId(userId), isAdmin);
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error changing user role", error });
  }
});

export default router;


