import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { type Request, type Response, type NextFunction } from "express";

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  emailAddress: string;
  role: string;
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }

    if (!token) {
      token = req.cookies.authToken;
      if (token) {
      }
    }

    // Check token availability
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in.",
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY as string) as User;

    req.user = decoded;

    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({
        success: false,
        message: "Invalid token.",
      });
    }

    if (err instanceof jwt.TokenExpiredError) {
      return res.status(403).json({
        success: false,
        message: "Token expired. Please log in again.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
