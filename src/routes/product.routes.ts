import { productSchema, productUpdateSchema } from "../shared/index.js";
import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct
} from "../controllers/product.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";

export const productRouter = Router();

productRouter.get("/", listProducts);
productRouter.get("/:id", getProduct);
productRouter.post("/", requireAuth, validateBody(productSchema), createProduct);
productRouter.put("/:id", requireAuth, validateBody(productUpdateSchema), updateProduct);
productRouter.delete("/:id", requireAuth, deleteProduct);
