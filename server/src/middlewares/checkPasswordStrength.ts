import { type Request, type Response, type NextFunction } from "express";
import zxcvbn from "zxcvbn";

export function passStrength(req: Request, res: Response, next: NextFunction) {
  const password = req.body.password;

  if (!password || typeof password !== "string") {
    return res.status(400).json({
      message: "Password is required.",
    });
  }

  const result = zxcvbn(password);
  if (result.score < 3) {
    return res.status(400).json({
      message: "Password is too weak.",
    });
  }
  next();
}
