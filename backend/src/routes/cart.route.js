const router = require("express").Router();
const controller = require("../controllers/cart.controller");
const { authUserMiddleware } = require("../middlewares/auth.midlleware");

router.use(authUserMiddleware);
router.get("/", controller.getCart);
router.post("/items", controller.addToCart);
router.patch("/items/:foodId", controller.updateCartItem);
router.delete("/items/:foodId", controller.removeCartItem);

module.exports = router;
