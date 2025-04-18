const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path")
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const contactRoutes = require("./routes/contactRoutes");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON
app.use("/public/uploads", express.static(path.join(__dirname, "public/uploads")));

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/contact", contactRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
