import { config } from "dotenv";
config();
import jwt from "jsonwebtoken";

const token = jwt.sign({ userId: '65f000000000000000000000', role: 'user' }, process.env.JWT_SECRET || 'development-jwt-secret-change-before-production', { expiresIn: "10m" });

async function testUpload() {
    console.log("== Executing Upload Endpoint ==");
    try {
        const response = await fetch("http://localhost:4000/uploads/presign", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                fileName: "test-product-image.jpg",
                contentType: "image/jpeg",
                type: "image"
            })
        });

        const status = response.status;
        const body = await response.text();

        console.log("HTTP Status:", status);
        console.log("Response Body:", body);
    } catch (error) {
        console.error("HTTP Request Failed:", error);
    }
}

testUpload();
