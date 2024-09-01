import express from "express";
import {
  getUser,
  loginUser,
  logoutUser,
  singnupUser,
} from "../controller/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/signup", singnupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/user", verifyToken, getUser);

export default router;
