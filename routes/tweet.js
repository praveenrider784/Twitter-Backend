const router = require("express").Router();
const verifyToken = require("../middleware/verifytoken");
const {
  createTweet,
  deleteTweet,
  likeOrDislike,
  getAllTweets,
  getUserTweets,
  getExploreTweets,
} = require("../controllers/tweet");

router.post("/", verifyToken, createTweet);
router.delete("/:id", verifyToken, deleteTweet);
router.put("/:id/like", likeOrDislike);
router.get("/timeline/:id", getAllTweets);
router.get("/user/all/:id", getUserTweets);
router.get("/explore", getExploreTweets);
module.exports = router;
