const User = require("../models/User");
const Tweet = require("../models/Tweet");

const createTweet = async (req, res, next) => {
  const newTweet = new Tweet(req.body);
  try {
    const savedTweet = await newTweet.save();
    res.status(200).json(savedTweet);
  } catch (err) {
    res.status(500).send(err);
  }
};

const deleteTweet = async (req, res, next) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (tweet.userId === req.body.id) {
      await tweet.deleteOne();
      res.status(200).json("tweet has been deleted");
    } else {
      res.status(403).send("you cannot delete tweet of others");
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
const likeOrDislike = async (req, res, next) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet.likes.includes(req.body.id)) {
      await tweet.updateOne({ $push: { likes: req.body.id } });
      res.status(200).json("tweet has been liked");
    } else {
      await tweet.updateOne({ $pull: { likes: req.body.id } });
      res.status(200).json("tweet has been disliked");
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
const getAllTweets = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.params.id);

    const followingUserIds = currentUser.following;
    const followingTweets = await Tweet.find({
      userId: { $in: followingUserIds },
    })
      .sort({ createdAt: -1 })
      .exec();

    const userTweets = await Tweet.find({ userId: currentUser._id })
      .sort({ createdAt: -1 })
      .exec();

    const allTweets = [...userTweets, ...followingTweets].sort(
      (a, b) => b.createdAt - a.createdAt
    );
    res.status(201).json(allTweets);
  } catch (error) {
    res.status(500).send(error);
  }
};
const getUserTweets = async (req, res, next) => {
  try {
    const userTweets = await Tweet.find({ userId: req.params.id }).sort({
      createdAt: -1,
    });

    res.status(200).json(userTweets);
  } catch (err) {
    res.status(500).send(err);
  }
};
const getExploreTweets = async (req, res, next) => {
  try {
    const getExploreTweets = await Tweet.find({
      likes: { $exists: true },
    }).sort({ likes: -1 });

    res.status(200).json(getExploreTweets);
  } catch (err) {
    res.status(500).json(err);
  }
};
module.exports = {
  createTweet,
  deleteTweet,
  likeOrDislike,
  getAllTweets,
  getUserTweets,
  getExploreTweets,
};
