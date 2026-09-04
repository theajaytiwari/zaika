const foodModel = require("../models/food.model");
const foodPartnerModel = require("../models/foodpartner.model");
const storageService = require("../services/storage.service");
const { v4: uuid } = require("uuid");

function serializeFood(item) {
  const foodPartner = item.foodPartner && typeof item.foodPartner === "object" ? item.foodPartner : null;
  return {
    ...(item.toObject ? item.toObject() : item),
    foodPartner: foodPartner ? { _id: foodPartner._id, restaurantName: foodPartner.restaurantName } : item.foodPartner,
    foodPartnerId: foodPartner?._id?.toString() || item.foodPartner?.toString?.() || "",
  };
}

async function createFood(req, res, next) {
  try {
    const { name, description = "", price, category = "Chef special", videoUrl = "" } = req.body;
    if (!name?.trim() || price === undefined || Number(price) < 0) return res.status(400).json({ message: "Dish name and a valid price are required" });
    let video = videoUrl.trim();
    if (req.file) {
      const result = await storageService.uploadFile(req.file.buffer, `${uuid()}-${req.file.originalname}`);
      video = result.url;
    }
    const foodItem = await foodModel.create({ name: name.trim(), description: description.trim(), price: Number(price), category: category.trim(), video, foodPartner: req.foodPartner._id });
    res.status(201).json({ message: "Dish reel published", food: serializeFood(foodItem) });
  } catch (error) { next(error); }
}

async function getFoodItems(req, res, next) {
  try {
    const { q, category } = req.query;
    const filter = {};
    if (q) filter.$or = [{ name: { $regex: q, $options: "i" } }, { description: { $regex: q, $options: "i" } }];
    if (category && category !== "All") filter.category = category;
    const foodItems = await foodModel.find(filter).populate("foodPartner", "restaurantName").sort({ createdAt: -1 }).lean();
    res.json({ message: "Food items fetched", foodItems: foodItems.map(serializeFood) });
  } catch (error) { next(error); }
}

async function getFoodPartnerProfile(req, res, next) {
  try {
    const foodPartner = await foodPartnerModel.findById(req.params.id).lean();
    if (!foodPartner) return res.status(404).json({ message: "Restaurant not found" });
    const foodItems = await foodModel.find({ foodPartner: req.params.id }).sort({ createdAt: -1 }).lean();
    res.json({ message: "Restaurant fetched", foodPartner: { _id: foodPartner._id, restaurantName: foodPartner.restaurantName, ownerName: foodPartner.ownerName, address: foodPartner.address, totalVideos: foodItems.length, foodItems } });
  } catch (error) { next(error); }
}

async function getMyFoodPartnerProfile(req, res, next) {
  try {
    const foodItems = await foodModel.find({ foodPartner: req.foodPartner._id }).sort({ createdAt: -1 }).lean();
    res.json({ message: "Profile fetched", foodPartner: { _id: req.foodPartner._id, restaurantName: req.foodPartner.restaurantName, ownerName: req.foodPartner.ownerName, address: req.foodPartner.address, totalVideos: foodItems.length, foodItems } });
  } catch (error) { next(error); }
}

async function likeFood(req, res, next) {
  try {
    const food = await foodModel.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true });
    if (!food) return res.status(404).json({ message: "Dish not found" });
    res.json({ likes: food.likes });
  } catch (error) { next(error); }
}

async function deleteFood(req, res, next) {
  try {
    const food = await foodModel.findOneAndDelete({ _id: req.params.id, foodPartner: req.foodPartner._id });
    if (!food) return res.status(404).json({ message: "Dish not found" });
    res.json({ message: "Dish removed" });
  } catch (error) { next(error); }
}

module.exports = { createFood, getFoodItems, getFoodPartnerProfile, getMyFoodPartnerProfile, likeFood, deleteFood };
