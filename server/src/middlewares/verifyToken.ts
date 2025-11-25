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

// extend the request to include user
interface User {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  emailAddress: string;
}

// verify token 
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    // extract token from cookies
    const { authToken } = req.cookies;
    // check token availability
    if (!authToken) {
      return res.status(401).json({
        message: "Unauthorized. Please log in.",
      });
    }

    // verify the token
    const decoded = jwt.verify(authToken, process.env.SECRET_KEY as string, (error: any, decoded: any) => {
      if (error) {
        return res.status(403).json({
          message: "Invalid or expired token.",
        });
      }
      req.user = decoded as User;
      next();
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "Something went wrong. Please try again later.",
    });
  }
};
