import { authenticate, registerUser } from "../services/authService";
import { Router } from "express";
import { RegisterResponseDto } from "../util/dto";

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const userId = await registerUser(req.body);
    if (userId) {
      res.json({
        message: "Registration successful",
        userId: userId
      } satisfies RegisterResponseDto);
    }
    else {
      res.status(400).json({ message: 'Account already created' });
    }
  }
  catch (error: any) {
    console.log(error);
    res.status(500).json({ message: 'Account already created', error: error.message });
  }
});

router.post('/auth', async (req, res) => {
  try {
    const response = await authenticate(req.body);
    if (response) {
      res.json(response);
    }
    else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  }
  catch (error: any) {
    res.status(500).json({ message: 'Error authenticating a user', error: error.message });
  }
});

export default router;
