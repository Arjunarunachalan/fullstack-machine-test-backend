import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "node:crypto";
import { env } from "../config/env.js";
import { HttpError } from "../utils/http-error.js";

function assertR2Config() {
  if (
    !env.R2_ACCOUNT_ID ||
    !env.R2_ACCESS_KEY_ID ||
    !env.R2_SECRET_ACCESS_KEY ||
    !env.R2_BUCKET ||
    !env.R2_PUBLIC_URL
  ) {
    throw new HttpError(503, "Cloudflare R2 is not configured. Add R2 values to apps/api/.env.");
  }

  return {
    accountId: env.R2_ACCOUNT_ID,
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    bucket: env.R2_BUCKET,
    publicUrl: env.R2_PUBLIC_URL
  };
}

export async function createPresignedUploadUrl(input: {
  fileName: string;
  contentType: string;
  folder: "images" | "videos";
}) {
  const r2Config = assertR2Config();
  const r2 = new S3Client({
    region: "auto",
    endpoint: `https://${r2Config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: r2Config.accessKeyId,
      secretAccessKey: r2Config.secretAccessKey
    },
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED"
  });
  const extension = input.fileName.split(".").pop();
  const key = `${input.folder}/${randomUUID()}${extension ? `.${extension}` : ""}`;

  const command = new PutObjectCommand({
    Bucket: r2Config.bucket,
    Key: key,
    ContentType: input.contentType
  });

  const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 300 });
  const publicUrl = `${r2Config.publicUrl.replace(/\/$/, "")}/${key}`;

  return { key, uploadUrl, publicUrl };
}
