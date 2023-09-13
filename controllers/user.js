const User = require("../models/User");
const Tweet = require("../models/Tweet");

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).send(err);
  }
};

const update = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        {
          new: true,
        }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  } else {
    return res.status(403).send("you cannot update another account");
  }
};

const deleteuser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      await Tweet.remove({ userId: req.params.id });
      res.status(200).json("User deleted");
    } catch (err) {
      next(err);
    }
  } else {
    return res.status(403).send("you can delete only ur account");
  }
};
const follow = async (req, res, next) => {
  try {
    const usertobefollowed = await User.findById(req.params.id);
    const currentUser = await User.findById(req.body.id);

    if (!usertobefollowed.followers.includes(req.body.id)) {
      await usertobefollowed.updateOne({
        $push: { followers: req.body.id },
      });

      await currentUser.updateOne({ $push: { following: req.params.id } });
    } else {
      res.status(403).json("you already follow this user");
    }
    res.status(200).json("following the user");
  } catch (err) {
    next(err);
  }
};
const unfollow = async (req, res, next) => {
  try {
    const usertobeunfollowed = await User.findById(req.params.id);

    const currentUser = await User.findById(req.body.id);

    if (currentUser.following.includes(req.params.id)) {
      await usertobeunfollowed.updateOne({
        $pull: { followers: req.body.id },
      });

      await currentUser.updateOne({ $pull: { following: req.params.id } });
    } else {
      res.status(403).json("you are not following this user");
    }
    res.status(200).json("unfollowing the user");
  } catch (err) {
    next(err);
  }
};
module.exports = {
  getUser,
  update,
  deleteuser,
  follow,
  unfollow,
};
