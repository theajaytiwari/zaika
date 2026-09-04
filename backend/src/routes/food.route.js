const express = require("express");
const multer = require("multer");
const foodController = require("../controllers/food.controller");
const { authFoodPartnerMiddleware, authAnyMiddleware } = require("../middlewares/auth.midlleware");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

router.get("/", foodController.getFoodItems);
router.get("/partner/:id", foodController.getFoodPartnerProfile);
router.get("/me", authFoodPartnerMiddleware, foodController.getMyFoodPartnerProfile);
router.post("/", authFoodPartnerMiddleware, upload.single("video"), foodController.createFood);
router.post("/:id/like", authAnyMiddleware, foodController.likeFood);
router.delete("/:id", authFoodPartnerMiddleware, foodController.deleteFood);

module.exports = router;
