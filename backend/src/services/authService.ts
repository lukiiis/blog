import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import { User } from "../util/dao";
import { AuthRequestDto, AuthResponseDto, RegisterRequestDto, UserDto } from "../util/dto";
import { createUser, getUserByEmail } from "./userService";
import { ObjectId } from "mongodb";

dotenv.config();

function generateAccessToken(user: UserDto) {
  const secret = process.env.SECRET_KEY;
  console.log(user)
  if (!secret) {
    throw new Error("Missing secret key");
  }
  
  return jwt.sign(user, secret, { expiresIn: '1d' });
}

export async function registerUser(req: RegisterRequestDto) {
  const newUser: User = {
    _id: new ObjectId(),
    username: req.username,
    email: req.email,
    password: req.password,
    bio: req.bio,
    profilePicture: req.profilePicture,
    createdAt: new Date(),
    updatedAt: new Date(),
    isBlocked: false,
    isAdmin: false,
    isActive: true
  }
  return await createUser(newUser);
}

export async function authenticate(req: AuthRequestDto): Promise<AuthResponseDto | undefined> {
  const user = await getUserByEmail(req.email);
  if (!user) {
    throw new Error("User not found");
  }

  return {
    message: `User authenticated`,
    token: generateAccessToken(user),
    userId: user.id,
    isAdmin: user.isAdmin
  };
}