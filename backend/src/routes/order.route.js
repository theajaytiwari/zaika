const router = require("express").Router();
const controller = require("../controllers/order.controller");
const { authUserMiddleware, authFoodPartnerMiddleware } = require("../middlewares/auth.midlleware");

router.post("/", authUserMiddleware, controller.createOrder);
router.get("/mine", authUserMiddleware, controller.getMyOrders);
router.get("/partner", authFoodPartnerMiddleware, controller.getPartnerOrders);
router.patch("/:id/status", authFoodPartnerMiddleware, controller.updateOrderStatus);

module.exports = router;
