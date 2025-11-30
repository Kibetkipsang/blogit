import { type Request, type Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const client = new PrismaClient();

// register user
export const register = async (req: Request, res: Response) => {
  try {
    // get the body content
    const { firstName, lastName, userName, emailAdress, password } = req.body;
    if (!firstName || !lastName || !userName || !emailAdress || !password) {
      res.status(400).json({
        message: "All fields are required.",
      });
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // save user to database
    const user = await client.user.create({
      data: {
        firstName,
        lastName,
        userName,
        emailAdress,
        password: hashedPassword,
      },
    });
    res.status(200).json({
      message: "User created successfully.",
    });
  } catch (e) {
    res.status(500).json({
      message: "Something went wrong. Please try again later.",
    });
  }
};
// login

export const login = async function (req: Request, res: Response) {
  try {
    // find the user with the credentials
    const { identifier, password } = req.body;
    const user = await client.user.findFirst({
      where: {
        OR: [{ userName: identifier }, { emailAdress: identifier }],
      },
    });

    console.log(user);
    if (!user) {
      return res.status(400).json({
        success: false, // Add success flag
        message: "Wrong login credentials",
      });
    }

    // check password
    const passMatch = await bcrypt.compare(password, user.password);
    if (!passMatch) {
      return res.status(400).json({
        success: false, // Add success flag
        message: "Wrong login credentials",
      });
    }

    const payload = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      emailAdress: user.emailAdress,
      role: user.role,
    };

    // create tokens and save it to a cookie
    const token = jwt.sign(payload, process.env.SECRET_KEY!, {
      expiresIn: "2h",
    });

    // ✅ FIX: Add proper cookie options
    res.cookie("authToken", token, {
      httpOnly: true, // Prevents client-side JS from reading the cookie
      secure: process.env.NODE_ENV === "production", // false for localhost
      sameSite: "lax", // Allows cross-origin requests
      maxAge: 2 * 60 * 60 * 1000, // 2 hours in milliseconds
      path: "/", // Available to all routes
      // domain: "localhost" // Optional: explicitly set domain
    });

    // ✅ Also return success response with user data
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: payload,
      token: token, // Also send token in response body
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
// logout

export const logout = async (_req: Request, res: Response) => {
  try {
    res.clearCookie("authToken").status(200).json({
      message: "logged out successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "something went wrong",
    });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { firstName, lastName, userName, currentPassword, newPassword } =
    req.body;

  if (!id) {
    return res.status(400).json({ message: "User ID missing" });
  }

  try {
    const user = await client.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const updates: any = { firstName, lastName, userName };

    if (newPassword) {
      const match = await bcrypt.compare(currentPassword, user.password);
      if (!match)
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });

      updates.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await client.user.update({
      where: { id },
      data: updates,
    });

    res.status(200).json({
      id: updatedUser.id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      userName: updatedUser.userName,
      emailAdress: updatedUser.emailAdress,
    });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};
