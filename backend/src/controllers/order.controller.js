const orderModel = require("../models/order.model");
const cartModel = require("../models/cart.model");

const DELIVERY_FEE = 39;

async function createOrder(req, res, next) {
  try {
    const { address, paymentMethod = "COD" } = req.body;
    if (!address?.trim()) return res.status(400).json({ message: "Delivery address is required" });
    const cart = await cartModel.findOne({ user: req.user._id }).populate({ path: "items.food", populate: { path: "foodPartner", select: "restaurantName" } });
    const validItems = (cart?.items || []).filter((item) => item.food);
    if (!validItems.length) return res.status(400).json({ message: "Your cart is empty" });
    const items = validItems.map((item) => ({ food: item.food._id, name: item.food.name, price: item.food.price, quantity: item.quantity, restaurantName: item.food.foodPartner?.restaurantName || "Zaika kitchen" }));
    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const order = await orderModel.create({ user: req.user._id, items, address: address.trim(), paymentMethod, subtotal, deliveryFee: DELIVERY_FEE, total: subtotal + DELIVERY_FEE });
    cart.items = [];
    await cart.save();
    res.status(201).json({ message: "Order placed", order });
  } catch (error) { next(error); }
}

async function getMyOrders(req, res, next) {
  try {
    const orders = await orderModel.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
    res.json({ orders });
  } catch (error) { next(error); }
}

async function getPartnerOrders(req, res, next) {
  try {
    const orders = await orderModel.find({ "items.food": { $in: await require("../models/food.model").find({ foodPartner: req.foodPartner._id }).distinct("_id") } }).sort({ createdAt: -1 }).lean();
    res.json({ orders });
  } catch (error) { next(error); }
}

async function updateOrderStatus(req, res, next) {
  try {
    const validStatuses = ["ACCEPTED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];
    if (!validStatuses.includes(req.body.status)) return res.status(400).json({ message: "Invalid status" });
    const ownedFoods = await require("../models/food.model").find({ foodPartner: req.foodPartner._id }).distinct("_id");
    const order = await orderModel.findOne({ _id: req.params.id, "items.food": { $in: ownedFoods } });
    if (!order) return res.status(404).json({ message: "Order not found" });
    order.status = req.body.status;
    await order.save();
    res.json({ order });
  } catch (error) { next(error); }
}

module.exports = { createOrder, getMyOrders, getPartnerOrders, updateOrderStatus };
