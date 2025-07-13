import { AppError } from "../errors/AppError";
import config from "../config/config";
import { OAuth2Client } from "google-auth-library";
import { StatusCodes } from "http-status-codes";

const client = new OAuth2Client(config.google.clientId);

export interface GoogleUserInfo {
    email: string;
    firstName: string;
    lastName: string;
    googleId: string;
}

export const verifyGoogleToken = async (token: string): Promise<GoogleUserInfo> => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: config.google.clientId
        })

        const payload = ticket.getPayload();
        if (!payload) {
            throw new AppError('Invalid Google token', StatusCodes.UNAUTHORIZED)
        }

        if (!payload.email || !payload.given_name || !payload.family_name) {
            throw new AppError('Missing required user information', StatusCodes.UNAUTHORIZED);
        }

        return {
            email: payload.email,
            firstName: payload.given_name,
            lastName: payload.family_name,
            googleId: payload.sub
        }
    } catch (error) {
        throw new AppError('Google token verification failed', StatusCodes.UNAUTHORIZED)
    }
}