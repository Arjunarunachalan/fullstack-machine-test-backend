import "express-async-errors";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { ZodError } from "zod";
import { env } from "./config/env.js";
import { authRouter } from "./routes/auth.routes.js";
import { cartRouter } from "./routes/cart.routes.js";
import { productRouter } from "./routes/product.routes.js";
import { uploadRouter } from "./routes/upload.routes.js";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/health", (_req, res) => {
  res.json({ data: { status: "ok" } });
});

app.use("/auth", authRouter);
app.use("/products", productRouter);
app.use("/cart", cartRouter);
app.use("/uploads", uploadRouter);

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof ZodError) {
    return res.status(422).json({
      message: "Validation failed",
      fieldErrors: error.flatten().fieldErrors
    });
  }

  const statusCode =
    typeof error === "object" && error && "statusCode" in error
      ? Number(error.statusCode)
      : 500;
  const message =
    typeof error === "object" && error && "message" in error
      ? String(error.message)
      : "Internal server error";
  const details = typeof error === "object" && error && "details" in error ? error.details : undefined;

  return res.status(statusCode || 500).json({
    message,
    ...(details ? { fieldErrors: details } : {})
  });
});
