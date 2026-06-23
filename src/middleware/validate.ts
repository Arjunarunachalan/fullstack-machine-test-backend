import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next({
        statusCode: 422,
        message: "Validation failed",
        details: result.error.flatten().fieldErrors
      });
    }

    req.body = result.data;
    return next();
  };
}
