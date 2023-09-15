const express = require("express");
const connectDB = require("./connectdb.js");
const authroutes = require("./routes/auth");
const useroutes = require("./routes/user.js");
const tweetroutes = require("./routes/tweet.js");
const cookieparser = require("cookie-parser");
const cors=require('cors');
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cookieparser());
app.use(
  cors({
    origin: "*",
    methods:["GET","POST","PUT","DELETE"],
    credentials: true,
  })
);
app.use("/auth", authroutes);
app.use("/users", useroutes);
app.use("/tweets", tweetroutes);
app.get("/", async (req, res) => {
  res.send("Twitter clone");
});
const startserver = () => {
  app.listen(process.env.PORT, () => {
    console.log("server is listening on port ");
  });
};

connectDB(process.env.MONGO_URI, startserver);
