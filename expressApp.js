import express from "express";

const app = express();
const PORT = 4000;

// Middleware
app.use(express.json());

// Shopping cart array
let cart = [
  {
    id: 1,
    productName: "Wireless Mouse",
    price: 799,
    quantity: 2,
    category: "Electronics",
  },
  {
    id: 2,
    productName: "Keyboard",
    price: 1200,
    quantity: 1,
    category: "Electronics",
  },
  {
    id: 3,
    productName: "Headphones",
    price: 1499,
    quantity: 1,
    category: "Accessories",
  },
];

// 1. GET - Retrieve all cart items
app.get("/cart", (req, res) => {
  res.status(200).json(cart);
});

// 2. GET - Retrieve product by ID
app.get("/cart/:id", (req, res) => {
  const id = Number(req.params.id);

  const product = cart.find((item) => item.id === id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  res.status(200).json({
    ...product,
    totalPrice: product.price * product.quantity,
  });
});

// 3. POST - Add new product
app.post("/cart", (req, res) => {
  const { id, productName, price, quantity, category } = req.body;

  if (
    id === undefined ||
    !productName ||
    price === undefined ||
    quantity === undefined
  ) {
    return res.status(400).json({
      message: "All required fields must be provided",
    });
  }

  if (
    !Number.isInteger(Number(id)) ||
    !Number.isFinite(Number(price)) ||
    !Number.isFinite(Number(quantity)) ||
    Number(price) < 0 ||
    Number(quantity) <= 0
  ) {
    return res.status(400).json({
      message: "Invalid product details",
    });
  }

  if (cart.some((item) => item.id === Number(id))) {
    return res.status(400).json({
      message: "Product ID already exists",
    });
  }

  const newProduct = {
    id: Number(id),
    productName,
    price: Number(price),
    quantity: Number(quantity),
    category: category || "General",
  };

  cart.push(newProduct);

  res.status(201).json({
    message: "Product added successfully",
    product: newProduct,
  });
});

// 4. PUT - Update product
app.put("/cart/:id", (req, res) => {
  const id = Number(req.params.id);

  const product = cart.find((item) => item.id === id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  const { productName, price, quantity, category } = req.body;

  if (
    (price !== undefined &&
      (!Number.isFinite(Number(price)) || Number(price) < 0)) ||
    (quantity !== undefined &&
      (!Number.isFinite(Number(quantity)) || Number(quantity) <= 0))
  ) {
    return res.status(400).json({
      message: "Invalid price or quantity",
    });
  }

  if (productName !== undefined) product.productName = productName;
  if (price !== undefined) product.price = Number(price);
  if (quantity !== undefined) product.quantity = Number(quantity);
  if (category !== undefined) product.category = category;

  res.status(200).json({
    message: "Product updated successfully",
    product: product,
  });
});

// 5. DELETE - Remove product
app.delete("/cart/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = cart.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  const deletedProduct = cart.splice(index, 1);

  res.status(200).json({
    message: "Product deleted successfully",
    product: deletedProduct[0],
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});
