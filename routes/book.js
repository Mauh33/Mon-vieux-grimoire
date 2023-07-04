const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const convertImageToWebP = require("../middleware/sharp");
const bookCtrl = require("../controllers/book");

router.get("/", bookCtrl.getAllBook);
router.get("/bestrating", bookCtrl.getBestRating);
router.get("/:id", bookCtrl.getOneBook);
router.post("/:id/rating", auth, bookCtrl.modifyRating);
router.post("/", auth, multer, convertImageToWebP, bookCtrl.createBook);
router.put("/:id", auth, multer, convertImageToWebP, bookCtrl.modifyBook);
router.delete("/:id", auth, bookCtrl.deleteBook);

module.exports = router;
