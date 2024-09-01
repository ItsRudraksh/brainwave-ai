import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const singnupUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 }); // 1 hour

    res
      .status(201)
      .json({ message: "User created successfully", userId: user._id });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 }); // 1 hour

    res.json({ message: "Logged in successfully", userId: user._id });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

export const getUser = async (req, res) => {
  const userId = req.user.id;
  try {
    const foundUser = await User.findById(userId);
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(foundUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error finding User" });
  }
};
