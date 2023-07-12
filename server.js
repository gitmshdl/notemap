require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const helmet = require("helmet");
const Messages = require("./src/Model/messageModel");

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

const connectionParams = { useNewUrlParser: true, useUnifiedTopology: true };

mongoose
  .connect(process.env.REACT_APP_MONGODB_URI, connectionParams)
  .then(() => {
    console.log("connected to db");
  })
  .catch((e) => {
    console.log(e);
  });

//app.post

app.post("/create", (req, res) => {
  const { name, message, latitude, longitude } = req.body;
  const newMessage = new Messages({
    name,
    message,
    latitude,
    longitude,
  });

  newMessage
    .save()
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
});

app.get("/read", (req, res) => {
  Messages.find()
    .then((data) => res.json(data))
    .catch((err) => console.log(err));
});

app.listen(3001, function () {
  console.log("server is running on 3001");
});
