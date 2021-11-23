const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const url =
  "mongodb+srv://admin:helloworld@cluster0.n95p6.mongodb.net/planner?retryWrites=true&w=majority";
const router = require("express").Router();
const foodSchema = new mongoose.Schema({
  food: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unit: {
    type: Number,
    required: true,
  },
  storage: {
    type: Number,
    required: true,
  },
  expiry: {
    type: Number,
    required: true,
  },
});
const mealplanner = mongoose.model("mealplanner", foodSchema);
const postOrder = async (req, res) => {
  const { food, quantity, unit, storage, expiry } = req.body;
  const food_name = new mealplanner({ food, quantity, unit, storage, expiry });
  await food_name.save();
  return res
    .status(201)
    .json({ status: "record successfully added", data: food_name });
};
const showOrder = async (req, res) => {
  const { storage } = req.query;
  const food_name = await mealplanner.find({ storage: storage });
  if (food_name.length === 0)
    return res.status(404).json({ status: "failed", message: "No data found" });
  return res.status(200).json({ status: "success", data: food_name });
};
const showall = async (req, res) => {
  const food_name = await mealplanner.find({});
  if (food_name.length === 0)
    return res.status(404).json({ status: "failed", message: "No data found" });
  return res.status(200).json({ status: "success", data: food_name });
};
app.get("/show", showOrder);
app.get("/showall", showall);
app.post("/post", postOrder);

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(app.listen(6000, () => console.log("Listening to port 6000")))
  .catch((err) => console.log(err));
