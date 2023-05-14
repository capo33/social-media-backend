import { Types } from "mongoose";
import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: Types.ObjectId;
         // email: string;
        // username: string;
      } | null;
    }
  }
}

export {};