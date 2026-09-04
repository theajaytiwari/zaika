const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  food: { type: mongoose.Schema.Types.ObjectId, ref: "food" },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  restaurantName: String,
}, { _id: false });

module.exports = mongoose.model("order", new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  items: { type: [orderItemSchema], validate: [(items) => items.length > 0, "An order needs an item"] },
  address: { type: String, required: true, trim: true },
  paymentMethod: { type: String, enum: ["COD", "UPI", "CARD"], default: "COD" },
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, required: true },
  total: { type: Number, required: true },
  status: { type: String, enum: ["PLACED", "ACCEPTED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"], default: "PLACED" },
}, { timestamps: true }));
