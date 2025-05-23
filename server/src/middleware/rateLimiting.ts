import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5, 
    message: 'Too many login attempts, please try again after 10 minutes'
  });

  export const registerLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 3,
    message: 'Too many registration attempts, please try again after 5 minutes'
  });