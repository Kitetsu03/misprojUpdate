import express from "express";
const router = express.Router();
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./product.controller.js";

// Define routes for product operations

// Get all products
router.get("/", getProducts);
// Get a single product by ID
router.get("/:id", getProduct);
// Create a new product
router.post("/", createProduct);
// Update a product by ID
router.put("/:id", updateProduct);
// Delete a product by ID
router.delete("/:id", deleteProduct);

export default router;
