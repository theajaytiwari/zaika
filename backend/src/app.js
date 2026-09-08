// in this file we are going to create server 

const express = require("express");
const cookieparser = require("cookie-parser");
const authRoutes = require("./routes/auth.route");
const foodRoutes = require("./routes/food.route");
const cartRoutes = require("./routes/cart.route");
const orderRoutes = require("./routes/order.route");
const cors = require('cors');

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((url) => url.trim().replace(/\/$/, ''))
  : ["http://localhost:5173", "http://localhost:3000"];

const app = express();
app.use(cors({
    origin: function (origin, callback) {
        if (
            !origin ||
            allowedOrigins.includes(origin.replace(/\/$/, ''))
        ) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
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
