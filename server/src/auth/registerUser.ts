import { AuthResponse, RegisterData } from "./types";
import { User } from "../models/User";
import { AppError } from "../errors/AppError";
import { StatusCodes } from "http-status-codes";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

export async function register(data: RegisterData): Promise<AuthResponse> {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw new AppError('Email already registered', StatusCodes.CONFLICT);
  }

  const user = await User.create(data);

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    user: user.toObject(),
    accessToken,
    refreshToken
  };
}