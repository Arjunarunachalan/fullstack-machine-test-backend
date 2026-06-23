import type { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model.js";
import { verifyAccessToken } from "../utils/jwt.js";

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

    if (!token) {
      return next({ statusCode: 401, message: "Authentication required" });
    }

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub).select("_id name email");

    if (!user) {
      return next({ statusCode: 401, message: "Invalid authentication token" });
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email
    };

    return next();
  } catch {
    return next({ statusCode: 401, message: "Invalid authentication token" });
  }
}
