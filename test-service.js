import { config } from "dotenv";
config();
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "node:crypto";

const r2 = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
    },
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED"
});

const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: "test-fetch-error.jpg",
    ContentType: "image/jpeg"
});

async function test() {
    const url = await getSignedUrl(r2, command, { expiresIn: 300 });
    console.log("Presigned URL:", url);

    const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "image/jpeg" },
        body: "fake image data 123"
    });

    console.log("Status:", res.status);
    console.log("Body:", await res.text());
}
test();
