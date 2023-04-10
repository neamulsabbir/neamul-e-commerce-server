const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express')
const cors = require('cors')
const app = express()
const port = 5000

// neamulE-commerce
// t60nZwyKZNpAUY6A

app.use(cors())
app.use(express.json());


const uri = "mongodb+srv://neamulE-commerce:t60nZwyKZNpAUY6A@cluster0.ivmjea7.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  try {
    const products = client.db("neamulE-commerce").collection("products")
   

    app.get('/products', async(req,res) => {
      const query = {}
      const result = await products.find(query).toArray()
      res.send(result) 
    })

    app.get('/products/:name', async(req,res) => {
      const name = req.params.name;
      const query = {category: name}
      const result = await products.find(query).toArray()
      res.send(result)
    })
    
    app.get('/products/allProducts/:slug', async(req,res) => {
      const slug = req.params.slug;
      // console.log(slug);
      const query = {'allProducts.slug': slug}
      const result = await products.findOne(query)
      const currentProduct = result.allProducts.find(item => item.slug === slug)

      res.send(currentProduct)
    })


  } 
  finally {
    
  }
}
run().catch(console.dir);












app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})