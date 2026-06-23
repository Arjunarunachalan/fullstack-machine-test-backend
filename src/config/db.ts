import mongoose from "mongoose";
import { env } from "./env.js";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

export async function connectDb() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.MONGODB_URI);
}
