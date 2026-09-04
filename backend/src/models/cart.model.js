const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  food: { type: mongoose.Schema.Types.ObjectId, ref: "food", required: true },
  quantity: { type: Number, default: 1, min: 1, max: 20 },
}, { _id: false });

module.exports = mongoose.model("cart", new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true, unique: true },
  items: { type: [cartItemSchema], default: [] },
}, { timestamps: true }));
