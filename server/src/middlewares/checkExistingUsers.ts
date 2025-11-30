import { type Request, type Response, type NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

// check if username and email adress is already registered
export const legitimate = async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { userName, emailAdress } = req.body;
  try {
    if (userName) {
      const existingUserName = await client.user.findUnique({
        where: {
          userName: String(userName),
        },
      });

      if (existingUserName) {
        return res.status(400).json({
          message: "Username already taken.",
        });
      }
    }
    if (emailAdress) {
      const existingEmail = await client.user.findUnique({
        where: {
          emailAdress: String(emailAdress),
        },
      });
      if (existingEmail) {
        return res.status(400).json({
          message: "Email Adress is already taken.",
        });
      }
    }
    next();
  } catch (e) {
    res.status(500).json({
      message: "Something went wrong. Please try again later.",
    });
  }
};
