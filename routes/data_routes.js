const { Router } = require("express");
const authController = require("../controllers/authController");
const homeController = require("../controllers/homeController");
const checkKey = require("../middlewares/checkKey");

const router = Router();

router.post("/signup", authController.signup_post);

router.get("/data/:key", checkKey, homeController.data_get)
router.get("/data", checkKey, homeController.data_get)
router.get("/data/:key/:param", checkKey, homeController.data_get_param)

module.exports = router;
