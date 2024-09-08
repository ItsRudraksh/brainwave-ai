import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chat.js";
import imagekitRoutes from "./routes/imagekit.js";
import { verifyToken } from "./middleware/verifyToken.js";
import path from "path";
import url from "url";

dotenv.config();

const app = express();

const __filename = url.fileURLToPath(import.meta.url); //FOR DEPLOYMENT
const __dirname = path.dirname(__filename); //FOR DEPLOYMENT

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ credentials: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../../client/dist"))); //FOR DEPLOYMENT

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/imagekit", imagekitRoutes);

// Protected route example
app.get("/api/v1/protected", verifyToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

//FOR DEPLOYMENT
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/dist", "index.html"));
});

export default app;
