import type { Request, Response } from "express";
import { z } from "zod";
import { createPresignedUploadUrl } from "../services/r2.service.js";

const presignSchema = z.object({
  fileName: z.string().min(1),
  contentType: z.string().min(1),
  type: z.enum(["image", "video"])
});

export async function createUploadUrl(req: Request, res: Response) {
  try {
    const input = presignSchema.parse(req.body);
    const data = await createPresignedUploadUrl({
      fileName: input.fileName,
      contentType: input.contentType,
      folder: input.type === "image" ? "images" : "videos"
    });

    return res.json({ data: { ...data, type: input.type } });
  } catch (error) {
    console.error("[Upload Error]: Failed to create upload URL", error);
    throw error;
  }
}
