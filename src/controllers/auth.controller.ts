import type { Request, Response } from "express";
import { User } from "../models/user.model.js";
import { signAccessToken } from "../utils/jwt.js";

export async function register(req: Request, res: Response) {
  const existing = await User.findOne({ email: req.body.email });

  if (existing) {
    return res.status(409).json({ message: "Email is already registered" });
  }

  const user = await User.create(req.body);
  const token = signAccessToken({ sub: user.id, email: user.email });

  return res.status(201).json({
    data: {
      token,
      user: { id: user.id, name: user.name, email: user.email }
    }
  });
}

export async function login(req: Request, res: Response) {
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await user.comparePassword(req.body.password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = signAccessToken({ sub: user.id, email: user.email });

  return res.json({
    data: {
      token,
      user: { id: user.id, name: user.name, email: user.email }
    }
  });
}

export async function me(req: Request, res: Response) {
  return res.json({ data: req.user });
}
