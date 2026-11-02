import http from "http";
import fs from "fs";

let cart = [
  {
    id: 1,
    productName: "Laptop",
    price: 50000,
    quantity: 1,
  },
  {
    id: 2,
    productName: "Mouse",
    price: 500,
    quantity: 2,
  },
];

const server = http.createServer((req, res) => {
  // Route 1: Home
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>Welcome to Shopping Cart</h1>");
  }

  // Route 2: Get Cart
  else if (req.url === "/cart" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(cart));
  }

  // Route 3: About
  else if (req.url === "/about") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("This is a Shopping Cart Management Application.");
  }

  // Route 4: Serve HTML using FS
  else if (req.url === "/home") {
    fs.readFile("./public/index.html", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error reading HTML file");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      }
    });
  }

  // Route 5: Add product
  else if (req.url === "/add-to-cart" && req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const product = JSON.parse(body);

        if (
          product.id === undefined ||
          !product.productName ||
          product.price === undefined ||
          product.quantity === undefined
        ) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Missing product details" }));
          return;
        }

        cart.push(product);

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Product added successfully",
            product: product,
          }),
        );
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Invalid JSON" }));
      }
    });
  }

  // Invalid route
  else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 - Page Not Found");
  }
});

server.listen(3000, () => {
  console.log("HTTP Server running at http://localhost:3000");
});
