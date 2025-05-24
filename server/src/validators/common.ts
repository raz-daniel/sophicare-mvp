import { z } from 'zod';
import mongoose from 'mongoose';

export const validateObjectId = (message = 'Invalid ID format') => {
    return z.string().refine(
        (val) => mongoose.Types.ObjectId.isValid(val),
        { message }
    );
}; 