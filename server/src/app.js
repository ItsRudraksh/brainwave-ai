import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chat.js";
import imagekitRoutes from "./routes/imagekit.js";
import { verifyToken } from "./middleware/verifyToken.js";

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/imagekit", imagekitRoutes);

// Protected route example
app.get("/api/v1/protected", verifyToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

export default app;
