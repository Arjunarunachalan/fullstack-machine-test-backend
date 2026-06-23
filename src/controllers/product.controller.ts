import type { Request, Response } from "express";
import { Product } from "../models/product.model.js";

export async function listProducts(req: Request, res: Response) {
  const products = await Product.find().sort({ createdAt: -1 });
  return res.json({ data: products });
}

export async function getProduct(req: Request, res: Response) {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  return res.json({ data: product });
}

export async function createProduct(req: Request, res: Response) {
  const product = await Product.create(req.body);
  return res.status(201).json({ data: product, message: "Product created" });
}

export async function updateProduct(req: Request, res: Response) {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  return res.json({ data: product, message: "Product updated" });
}

export async function deleteProduct(req: Request, res: Response) {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  return res.json({ data: { id: product.id }, message: "Product deleted" });
}
