const cartModel = require("../models/cart.model");
const foodModel = require("../models/food.model");

async function populatedCart(userId) {
  return cartModel.findOne({ user: userId }).populate({ path: "items.food", populate: { path: "foodPartner", select: "restaurantName" } });
}

function serialize(cart) {
  const items = (cart?.items || []).filter((item) => item.food).map((item) => ({
    food: item.food,
    quantity: item.quantity,
    subtotal: item.food.price * item.quantity,
  }));
  return { items, subtotal: items.reduce((total, item) => total + item.subtotal, 0) };
}

async function getCart(req, res, next) {
  try { res.json(serialize(await populatedCart(req.user._id))); } catch (error) { next(error); }
}

async function addToCart(req, res, next) {
  try {
    const { foodId, quantity = 1 } = req.body;
    if (!foodId || !Number.isInteger(Number(quantity)) || Number(quantity) < 1) return res.status(400).json({ message: "A dish and valid quantity are required" });
    if (!(await foodModel.exists({ _id: foodId }))) return res.status(404).json({ message: "Dish not found" });
    let cart = await cartModel.findOne({ user: req.user._id });
    if (!cart) cart = await cartModel.create({ user: req.user._id, items: [] });
    const item = cart.items.find((entry) => entry.food.toString() === foodId);
    if (item) item.quantity = Math.min(item.quantity + Number(quantity), 20);
    else cart.items.push({ food: foodId, quantity: Number(quantity) });
    await cart.save();
    res.status(201).json(serialize(await populatedCart(req.user._id)));
  } catch (error) { next(error); }
}

async function updateCartItem(req, res, next) {
  try {
    const quantity = Number(req.body.quantity);
    const cart = await cartModel.findOne({ user: req.user._id });
    const item = cart?.items.find((entry) => entry.food.toString() === req.params.foodId);
    if (!item) return res.status(404).json({ message: "Cart item not found" });
    if (!Number.isInteger(quantity) || quantity < 1) cart.items.pull({ food: req.params.foodId });
    else item.quantity = Math.min(quantity, 20);
    await cart.save();
    res.json(serialize(await populatedCart(req.user._id)));
  } catch (error) { next(error); }
}

async function removeCartItem(req, res, next) {
  try {
    const cart = await cartModel.findOne({ user: req.user._id });
    if (cart) { cart.items.pull({ food: req.params.foodId }); await cart.save(); }
    res.json(serialize(await populatedCart(req.user._id)));
  } catch (error) { next(error); }
}

module.exports = { getCart, addToCart, updateCartItem, removeCartItem };
