import { Schema, model } from "mongoose";

const mediaSchema = new Schema(
  {
    url: { type: String, required: true },
    key: { type: String, required: true },
    type: { type: String, enum: ["image", "video"], required: true }
  },
  { _id: false }
);

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true, trim: true },
    images: {
      type: [mediaSchema],
      validate: [(value: unknown[]) => value.length >= 3, "At least 3 images are required"],
      required: true
    },
    videos: { type: [mediaSchema], default: [] }
  },
  { timestamps: true }
);

export const Product = model("Product", productSchema);
