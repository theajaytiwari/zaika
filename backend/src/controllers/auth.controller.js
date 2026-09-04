const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const foodPartnerModel = require("../models/foodpartner.model");

const cookieOptions = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 1000 * 60 * 60 * 24 * 14,
};

function makeToken(account, role) {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is missing");
  return jwt.sign({ id: account._id, role }, process.env.JWT_SECRET, { expiresIn: "14d" });
}

function publicUser(user) {
  return { _id: user._id, fullName: user.fullName, email: user.email, phoneNumber: user.phoneNumber };
}

function publicPartner(partner) {
  return { _id: partner._id, restaurantName: partner.restaurantName, ownerName: partner.ownerName, email: partner.email, address: partner.address };
}

async function registerUser(req, res, next) {
  try {
    const { fullName, email, phoneNumber, password } = req.body;
    if (![fullName, email, phoneNumber, password].every(Boolean) || password.length < 6) {
      return res.status(400).json({ message: "Name, email, phone and a 6+ character password are required" });
    }
    if (await userModel.findOne({ email: email.toLowerCase() })) {
      return res.status(409).json({ message: "An account already exists with this email" });
    }
    const user = await userModel.create({ fullName: fullName.trim(), email: email.toLowerCase(), phoneNumber: phoneNumber.trim(), password: await bcrypt.hash(password, 12) });
    res.cookie("token", makeToken(user, "user"), cookieOptions);
    res.status(201).json({ message: "Welcome to Zaika", role: "user", user: publicUser(user) });
  } catch (error) { next(error); }
}

async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email?.toLowerCase() });
    if (!user || !(await bcrypt.compare(password || "", user.password))) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }
    res.cookie("token", makeToken(user, "user"), cookieOptions);
    res.json({ message: "Welcome back", role: "user", user: publicUser(user) });
  } catch (error) { next(error); }
}

async function registerFoodPartner(req, res, next) {
  try {
    const { restaurantName, ownerName, email, password, address } = req.body;
    if (![restaurantName, ownerName, email, password, address].every(Boolean) || password.length < 6) {
      return res.status(400).json({ message: "Restaurant, owner, email, address and a 6+ character password are required" });
    }
    if (await foodPartnerModel.findOne({ email: email.toLowerCase() })) {
      return res.status(409).json({ message: "A restaurant account already exists with this email" });
    }
    const foodPartner = await foodPartnerModel.create({ restaurantName: restaurantName.trim(), ownerName: ownerName.trim(), email: email.toLowerCase(), address: address.trim(), password: await bcrypt.hash(password, 12) });
    res.cookie("token", makeToken(foodPartner, "partner"), cookieOptions);
    res.status(201).json({ message: "Restaurant account created", role: "partner", foodPartner: publicPartner(foodPartner) });
  } catch (error) { next(error); }
}

async function loginFoodPartner(req, res, next) {
  try {
    const { email, password } = req.body;
    const foodPartner = await foodPartnerModel.findOne({ email: email?.toLowerCase() });
    if (!foodPartner || !(await bcrypt.compare(password || "", foodPartner.password))) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }
    res.cookie("token", makeToken(foodPartner, "partner"), cookieOptions);
    res.json({ message: "Welcome back", role: "partner", foodPartner: publicPartner(foodPartner) });
  } catch (error) { next(error); }
}

function logoutUser(req, res) {
  res.clearCookie("token", cookieOptions);
  res.json({ message: "Logged out successfully" });
}

function getUserProfile(req, res) {
  res.json({ message: "Profile fetched", user: publicUser(req.user) });
}

function getFoodPartnerProfile(req, res) {
  res.json({ message: "Profile fetched", foodPartner: publicPartner(req.foodPartner) });
}

module.exports = { registerUser, loginUser, registerFoodPartner, loginFoodPartner, logoutUser, logoutFoodPartner: logoutUser, getUserProfile, getFoodPartnerProfile };
