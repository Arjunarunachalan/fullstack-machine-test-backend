import { config } from "dotenv";
config();
import { PutBucketCorsCommand, S3Client } from "@aws-sdk/client-s3";

async function configureCors() {
    const r2 = new S3Client({
        region: "auto",
        endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID,
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
        }
    });

    const command = new PutBucketCorsCommand({
        Bucket: process.env.R2_BUCKET,
        CORSConfiguration: {
            CORSRules: [
                {
                    AllowedHeaders: ["*"],
                    AllowedMethods: ["PUT", "POST", "GET", "HEAD", "DELETE"],
                    AllowedOrigins: ["http://localhost:3000", "http://localhost:4000", "https://*"],
                    ExposeHeaders: []
                }
            ]
        }
    });

    try {
        await r2.send(command);
        console.log("CORS configured successfully on the bucket:", process.env.R2_BUCKET);
    } catch (error) {
        console.error("Failed to configure CORS:", error);
    }
}

configureCors();
