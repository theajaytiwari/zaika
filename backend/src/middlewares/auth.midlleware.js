const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const foodPartnerModel = require("../models/foodpartner.model");

function tokenFromRequest(req) {
  return req.cookies?.token || req.headers.authorization?.replace(/^Bearer\s+/i, "");
}

async function authenticate(req, res, next) {
  const token = tokenFromRequest(req);
  if (!token) return res.status(401).json({ message: "Please log in to continue" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const role = decoded.role;
    const account = role === "partner"
      ? await foodPartnerModel.findById(decoded.id)
      : await userModel.findById(decoded.id);
    if (!account) return res.status(401).json({ message: "Your session is no longer valid" });

    req.auth = { id: account._id.toString(), role: role || "user" };
    req.user = role === "partner" ? undefined : account;
    req.foodPartner = role === "partner" ? account : undefined;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Your session has expired. Please log in again." });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (req.auth?.role !== role) return res.status(403).json({ message: "You do not have access to this action" });
    next();
  };
}

module.exports = {
  authenticate,
  authUserMiddleware: [authenticate, requireRole("user")],
  authFoodPartnerMiddleware: [authenticate, requireRole("partner")],
  authAnyMiddleware: authenticate,
};
