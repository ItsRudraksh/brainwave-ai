import express from "express";
import { getAuthenticationParameters } from "../services/imagekitService.js";

const router = express.Router();

router.get("/auth", async (req, res) => {
  try {
    const result = await getAuthenticationParameters();
    res.send(result);
  } catch (error) {
    console.error("Image Kit auth failed: ", error);
    res.status(500).json({
      message: "Image kit auth failed",
      error: error.message || "Unknown error",
    });
  }
});

export default router;
