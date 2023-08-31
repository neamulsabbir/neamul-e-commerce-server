const express = require("express");
const { ObjectId } = require("mongodb");
const cors = require("cors");
const router = express.Router();
const { productsCollection } = require("../Database/db");

router.use(cors());
router.use(express.json());

// Now, you can use the products collection as follows:

router.get("/products", async (req, res) => {
  try {
    const products = await productsCollection();
    const query = {};
    const result = await products.find(query).toArray();
    res.send(result);
  } catch (err) {
    res.sendStatus(500);
  }
});

router.get("/products/:name", async (req, res) => {
  try {
    const products = await productsCollection();
    const name = req.params.name;
    const query = { category: name };
    const result = await products.find(query).toArray();
    res.send(result);
  } catch (err) {
    res.sendStatus(500);
  }
});

module.exports = router;