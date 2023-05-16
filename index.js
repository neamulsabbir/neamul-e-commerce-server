const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
// const uuid = require("uuid");
const shortid = require("shortid");
const app = express();
const port = 5000;
// const productNumber = uuid.v4();

// neamulE-commerce
// t60nZwyKZNpAUY6A

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://neamulE-commerce:t60nZwyKZNpAUY6A@cluster0.ivmjea7.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const products = client.db("neamulE-commerce").collection("products");
    const colors = client.db("neamulE-commerce").collection("colors");

    try {
      app.get("/products", async (req, res) => {
        const query = {};
        const result = await products.find(query).toArray();
        res.send(result);
      });
    } catch (err) {
      res.sendStatus(500);
    }

    try {
      app.get("/products/:name", async (req, res) => {
        const name = req.params.name;
        const query = { category: name };
        const result = await products.find(query).toArray();
        res.send(result);
      });
    } catch (err) {
      res.sendStatus(500);
    }

    try {
      app.get("/products/allProducts/:slug", async (req, res) => {
        const slug = req.params.slug;
        // console.log(slug);
        const query = { "products.slug": slug };
        const result = await products.findOne(query);
        const currentProduct = result.products.find(
          (item) => item.slug === slug
        );

        res.send(currentProduct);
      });
    } catch (err) {
      res.sendStatus(500);
    }

    try {
      app.get("/colors", async (req, res) => {
        const query = {};
        const result = await colors.find(query).toArray();
        res.send(result);
      });
    } catch (err) {
      res.sendStatus(500);
    }

    try {
      app.get("/dashboard/product/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await products.find(query).toArray();
        res.send(result);
      });
    } catch (err) {
      res.sendStatus(500);
    }

    try {
      app.put("/dashboard/product/:id", async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const newProduct = req.body;
        // console.log(newProduct);
        const update = {
          $push: {
            products: {
              image: newProduct.image,
              title: newProduct.title,
              color: newProduct.color,
              price: newProduct.price,
              regularPrice: newProduct.regularPrice,
              slug: newProduct.slug + shortid.generate(),
              id: shortid.generate(),
            },
          },
        };

        const options = { upsert: true };
        const result = await products.updateOne(filter, update, options);
        res.send(result);
      });
    } catch (err) {
      res.sendStatus(500);
    }

    try {
      app.delete("/dashboard/product/:id", async (req, res) => {
        const id = req.params.id;
        // console.log(id);
        const query = { "products.id": id };
        const deleteProduct = {
          $pull: {
            products: { id: id },
          },
        };
        const result = await products.updateOne(query, deleteProduct);
        res.send(result);
      });
    } catch (err) {
      console.log(err);
    }

    try{
      app.put('/dashboard/editProduct/:id', async (req,res) => {
        const id = req.params.id
        const query = {"products.id" : id}
        const product = req.body
        // console.log(products);
        const updateProduct = {
          $set: {
            // "products.$.image": req.body.image,
            "products.$.title": product.title,
            "products.$.color": product.color,
            "products.$.price": product.price,
            "products.$.regularPrice": product.regularPrice,
            "products.$.slug": product.slug + shortid.generate()
          },
        }
        const options = {upsert: true}
        const result = await products.updateOne(query, updateProduct,options)
        res.send(result)
      })
    }catch(err){
      console.log(err);
    }

  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
