const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const shortid = require("shortid");
const app = express();
const port = 5000;
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

// neamulE-commerce
// t60nZwyKZNpAUY6A

app.use(cors({
  origin: 'http://localhost:3000',
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'))

const uri =
  "mongodb+srv://neamulE-commerce:t60nZwyKZNpAUY6A@cluster0.ivmjea7.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const colors = client.db("neamulE-commerce").collection("colors");
    const users = client.db("neamulE-commerce").collection("users");
    const orders = client.db("neamulE-commerce").collection("orders");
    const productsCollection = client.db("neamulE-commerce").collection("productss");
    const bannerCollection = client.db("neamulE-commerce").collection("product banner");

    app.get('/api/products', async (req, res) => {
      const result = await productsCollection.find({}).toArray();
      res.send(result)
    })

    app.delete('/api/products/deleteProducts/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await productsCollection.deleteOne(query)
      res.send(result)
    })

    app.get("/api/products/:name", async (req, res) => {
      const name = req.params.name;
      console.log(name);
      const query = { category: name };
      const result = await productsCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/api/allProducts/:slug", async (req, res) => {
      const slug = req.params.slug;
      // console.log(slug);
      const query = { slug: slug };
      const result = await productsCollection.findOne(query)
      res.send(result);
    });
    app.post('/api/products/addProducts', upload.single('image'), async (req, res) => {
      const title = req.body.title
      const slug = req.body.slug
      const color = req.body.color
      const stock = req.body.stock
      const price = req.body.price
      const regularPrice = req.body.regularPrice
      const costPrice = req.body.costPrice
      const category = req.body.category
      const details = req.body.details
      const userName = req.body.userName
      const date = req.body.date
      const image = req.file.path
      const data = { title, slug, color, stock, price, regularPrice, costPrice, category, details, userName, date, image }
      const result = await productsCollection.insertOne(data)
      res.send(result)
    })
    app.put('/api/products/editProducts/:id', upload.single('image'), async (req, res) => {
      console.log(req.body, req.file);
      if (req.file) {
        const id = req.params.id
        const filter = { _id: new ObjectId(id) }
        const update = {
          $set: {
            title: req.body.title,
            slug: req.body.slug,
            color: req.body.color,
            stock: req.body.stock,
            price: req.body.price,
            regularPrice: req.body.regularPrice,
            costPrice: req.body.costPrice,
            category: req.body.category,
            details: req.body.details,
            userName: req.body.userName,
            date: req.body.date,
            image: req.file.path
          },
        };
        const options = { upsert: true };
        const result = await productsCollection.updateOne(filter, update, options);
        res.send(result)
      } else {
        const id = req.params.id
        const filter = { _id: new ObjectId(id) }
        const update = {
          $set: {
            title: req.body.title,
            slug: req.body.slug,
            color: req.body.color,
            stock: req.body.stock,
            price: req.body.price,
            regularPrice: req.body.regularPrice,
            costPrice: req.body.costPrice,
            category: req.body.category,
            details: req.body.details,
            userName: req.body.userName,
            date: req.body.date,
            image: req.body.image
          },
        };
        const options = { upsert: true };
        const result = await productsCollection.updateOne(filter, update, options);
        res.send(result)
      }
    })

    app.get('/api/banner', async (req, res) => {
      const result = await bannerCollection.find({}).toArray();
      res.send(result)
    })

    app.delete('/api/delete-banner-category/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await bannerCollection.deleteOne(query);
      res.send(result)
    })

    app.post('/api/added-banner-category', upload.single('banner'), async (req, res) => {
      if (req.file) {
        const category = req.body.category
        const banner = req.file.path
        const data = { category, banner }
        const result = await bannerCollection.insertOne(data)
        res.send(result)
      } else {
        const category = req.body
        const result = await bannerCollection.insertOne(category)
        res.send(result)
      }

    })

    app.put('/api/edit-banner-category/:id', upload.single('banner'), async (req, res) => {
      if (req.file) {
        const id = req.params.id
        const filter = { _id: new ObjectId(id) }
        const update = {
          $set: {
            category: req.body.category,
            banner: req.file.path
          },
        };
        const options = { upsert: true };
        const result = await productsCollection.updateOne(filter, update, options);
        res.send(result)
      } else {
        const id = req.params.id
        const filter = { _id: new ObjectId(id) }
        const update = {
          $set: {
            category: req.body.category,
            banner: req.body.banner
          },
        };
        const options = { upsert: true };
        const result = await productsCollection.updateOne(filter, update, options);
        res.send(result)
      }
    })

    app.get("/colors", async (req, res) => {
      const query = {};
      const result = await colors.find(query).toArray();
      res.send(result);
    });


    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await users.insertOne(user);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const user = req.body;
      const result = await users.find(user).toArray();
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await users.deleteOne(query);
      res.send(result);
    });

    app.get("/userss/admin/:email", async (req, res) => {
      const email = req.params.email;
      console.log(email)
      const query = { email };
      const result = await users.findOne(query)
      res.send({ isAdmin: result?.role === 'admin' })
    });

    app.put("/users/admin/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          role: "admin",
        },
      };
      const result = await users.updateOne(query, updateDoc, options)
      res.send(result)
    });


    app.put("/users/delete-admin/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $unset: {
          role: "",
        },
      };
      const result = await users.updateOne(query, updateDoc, options)
      res.send(result)
    });

    app.get('/orders', async (req, res) => {
      let query = {}
      if (req.query.email) {
        query = {
          email: req.query.email
        }
      }
      const result = await orders.find(query).toArray()
      res.send(result)
    })

    app.post('/orders', async (req, res) => {
      const ordersData = req.body
      const result = await orders.insertOne(ordersData)
      res.send(result)
    })

    app.delete('/orders/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await orders.deleteOne(query)
      res.send(result)
    })

    app.get('/dashboard/orders', async (req, res) => {
      let query = {}
      const result = await orders.find(query).toArray()
      res.send(result)
    })

    app.delete('/dashboard/orders/:id', async (req, res) => {
      const id = req.params.id
      let query = { _id: new ObjectId(id) }
      const result = await orders.deleteOne(query)
      res.send(result)
    })

    app.put('/api/dashboard/orders/:id', async (req, res) => {
      const id = req.params.id
      console.log(id);
      const query = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updateDoc = {
        $set: {
          status: "approved",
        },
      }
      const result = await orders.updateOne(query, updateDoc, options)
      res.send(result)
    })

  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})

