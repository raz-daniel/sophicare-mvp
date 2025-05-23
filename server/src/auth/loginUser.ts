import { AuthResponse, LoginData } from "./types";
import { User } from "../models/User";
import { AppError } from "../errors/AppError";
import { StatusCodes } from "http-status-codes";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

export async function login(data: LoginData): Promise<AuthResponse> {
    const user = await User.findOne({ email: data.email }).select('+password');
    if (!user) {
      throw new AppError('Invalid credentials', StatusCodes.UNAUTHORIZED);
    }

    const isPasswordValid = await user.comparePassword(data.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', StatusCodes.UNAUTHORIZED);
    }

    if (user.accountStatus !== 'active') {
      throw new AppError('Account is not active', StatusCodes.FORBIDDEN);
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return {
      user: user.toObject(),
      accessToken,
      refreshToken
    };
  }