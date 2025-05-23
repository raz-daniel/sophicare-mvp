import { AuthResponse } from "./types";
import { User } from "../models/User";
import { AppError } from "../errors/AppError";
import { StatusCodes } from "http-status-codes";
import { generateAccessToken, generateRefreshToken, verifyToken } from "../utils/jwt";

export async function refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const decoded = verifyToken(refreshToken);
      const user = await User.findById(decoded.userId);

      if (!user) {
        throw new AppError('User not found', StatusCodes.NOT_FOUND);
      }

      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);

      return {
        user: user.toObject(),
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      throw new AppError('Invalid refresh token', StatusCodes.UNAUTHORIZED);
    }
  }