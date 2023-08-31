const { MongoClient, ServerApiVersion } = require("mongodb");

const uri =
  "mongodb+srv://neamulE-commerce:t60nZwyKZNpAUY6A@cluster0.ivmjea7.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// Export the products collection
exports.productsCollection = async () => {
    try {
      console.log("Connecting to MongoDB...");
      await client.connect();
      console.log("Connected to MongoDB successfully!");
      const products = client.db("neamulE-commerce").collection("products");
      return products;
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      throw error;
    }
  };