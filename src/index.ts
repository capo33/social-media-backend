import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import cors from "cors";

import env from "../src/utils/validateEnv";
import { connectDB } from "../src/config/db";
import authRoutes from "../src/routes/Auth.routes";
import postRoutes from "../src/routes/Post.routes";

// Load env variables
dotenv.config();

// Init express
export const app: Application = express();

// Set port
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Welcome route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the API" });
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/posts", postRoutes);

// Start server
try {
  app.listen(PORT, (): void => {
    console.log(`Server is running on port ${PORT} 🚀`);
  });
} catch (error) {
  if (error instanceof Error) {
    console.log(`Error occured: (${error.message})`);
  }
}
