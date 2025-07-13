import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { User } from "../models/User";
import { verifyGoogleToken } from "../utils/googleAuth";
import { AuthResponse } from "./types";

export const authenticateWithGoogle = async (googleToken: string): Promise<AuthResponse> => {
    const googleUser = await verifyGoogleToken(googleToken);

    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
        user = await User.create({
            firstName: googleUser.firstName,
            lastName: googleUser.lastName,
            email: googleUser.email,
            googleId: googleUser.googleId,
            emailStatus: 'verified'
        });
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return {
        user: user.toObject(),
        accessToken,
        refreshToken
    }
}