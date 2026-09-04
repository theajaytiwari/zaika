const express = require("express");
const authController = require("../controllers/auth.controller");
const { authUserMiddleware, authFoodPartnerMiddleware } = require("../middlewares/auth.midlleware");

const router = express.Router();

// user auth API routes
router.post('/user/register',authController.registerUser)
router.post('/user/login', authController.loginUser)
router.get("/user/logout", authController.logoutUser);
router.get("/user/me", authUserMiddleware, authController.getUserProfile);

// food partner auth API routes
router.post('/food-partner/register', authController.registerFoodPartner)
router.post('/food-partner/login', authController.loginFoodPartner)
router.get("/food-partner/logout", authController.logoutFoodPartner);
router.get("/food-partner/me", authFoodPartnerMiddleware, authController.getFoodPartnerProfile);


module.exports = router;
