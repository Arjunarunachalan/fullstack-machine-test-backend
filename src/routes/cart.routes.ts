import { cartMutationSchema, cartRemoveSchema } from "../shared/index.js";
import { Router } from "express";
import {
  addCartItem,
  getCart,
  removeCartItem,
  updateCartItem
} from "../controllers/cart.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";

export const cartRouter = Router();

cartRouter.use(requireAuth);
cartRouter.get("/", getCart);
cartRouter.post("/add", validateBody(cartMutationSchema), addCartItem);
cartRouter.post("/remove", validateBody(cartRemoveSchema), removeCartItem);
cartRouter.post("/update", validateBody(cartMutationSchema), updateCartItem);
