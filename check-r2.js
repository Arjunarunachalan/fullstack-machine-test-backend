import { config } from "dotenv";
config();

console.log("R2_ACCOUNT_ID:", !!process.env.R2_ACCOUNT_ID);
console.log("R2_ACCESS_KEY_ID:", !!process.env.R2_ACCESS_KEY_ID);
console.log("R2_SECRET_ACCESS_KEY:", !!process.env.R2_SECRET_ACCESS_KEY);
console.log("R2_BUCKET:", !!process.env.R2_BUCKET);
console.log("R2_PUBLIC_URL:", !!process.env.R2_PUBLIC_URL);
