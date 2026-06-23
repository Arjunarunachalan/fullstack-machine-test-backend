import { Router } from "express";
import { createUploadUrl } from "../controllers/upload.controller.js";
import { requireAuth } from "../middleware/auth.js";

export const uploadRouter = Router();

uploadRouter.post("/presign", requireAuth, createUploadUrl);
