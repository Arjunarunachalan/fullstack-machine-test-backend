import type { Request, Response } from "express";
import { Types } from "mongoose";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";

async function getOrCreateCart(userId: string) {
  return Cart.findOneAndUpdate(
    { userId },
    { $setOnInsert: { userId, items: [] } },
    { new: true, upsert: true }
  ).populate("items.productId");
}

export async function getCart(req: Request, res: Response) {
  const cart = await getOrCreateCart(req.user!.id);
  return res.json({ data: cart });
}

export async function addCartItem(req: Request, res: Response) {
  const product = await Product.findById(req.body.productId);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const cart = await Cart.findOneAndUpdate(
    { userId: req.user!.id },
    { $setOnInsert: { userId: req.user!.id, items: [] } },
    { new: true, upsert: true }
  );

  const productObjectId = new Types.ObjectId(req.body.productId);
  const item = cart.items.find((entry: any) => entry.productId.equals(productObjectId));

  if (item) {
    item.quantity = Math.min(99, item.quantity + req.body.quantity);
  } else {
    cart.items.push({ productId: productObjectId, quantity: req.body.quantity });
  }

  await cart.save();
  await cart.populate("items.productId");

  return res.json({ data: cart, message: "Item added to cart" });
}

export async function removeCartItem(req: Request, res: Response) {
  const cart = await Cart.findOneAndUpdate(
    { userId: req.user!.id },
    { $pull: { items: { productId: req.body.productId } } },
    { new: true, upsert: true }
  ).populate("items.productId");

  return res.json({ data: cart, message: "Item removed from cart" });
}

export async function updateCartItem(req: Request, res: Response) {
  const cart = await Cart.findOneAndUpdate(
    { userId: req.user!.id, "items.productId": req.body.productId },
    { $set: { "items.$.quantity": req.body.quantity } },
    { new: true }
  ).populate("items.productId");

  if (!cart) {
    return res.status(404).json({ message: "Cart item not found" });
  }

  return res.json({ data: cart, message: "Cart updated" });
}
