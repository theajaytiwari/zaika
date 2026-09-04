// in this file we are going to create server 

const express = require("express");
const cookieparser = require("cookie-parser");
const authRoutes = require("./routes/auth.route");
const foodRoutes = require("./routes/food.route");
const cartRoutes = require("./routes/cart.route");
const orderRoutes = require("./routes/order.route");
const cors = require('cors');

const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));
app.use(cookieparser());
app.use(express.json());


app.get("/", (req, res) => res.json({ name: "Zaika API", status: "healthy" }));

app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

app.use((req, res) => res.status(404).json({ message: "Route not found" }));

app.use((error, req, res, next) => {
    console.error(error);
    res.status(error.status || 500).json({ message: error.message || "Something went wrong" });
});

module.exports = app;
