const router = require("express").Router();
const verifyToken = require("../middleware/verifytoken");
const {
  getUser,
  update,
  deleteuser,
  follow,
  unfollow,
} = require("../controllers/user");

router.put("/:id", verifyToken, update);
router.get("/find/:id", getUser);
router.delete("/:id", verifyToken, deleteuser);
router.put("/follow/:id", verifyToken, follow);
router.put("/unfollow/:id", verifyToken, unfollow);
module.exports = router;
