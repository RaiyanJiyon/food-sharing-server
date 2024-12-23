const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// const uri = "mongodb+srv://<db_username>:<db_password>@cluster0.pkcxb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pkcxb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const foodCollection = client.db("foodDB").collection("foods");

        app.get('/foods', async (req, res) => {
            try {
                const query = foodCollection.find();
                const result = await query.toArray();
                res.status(200).send(result);
            } catch (error) {
                res.status(500).send({ error: "Failed to fetch foods" });
            }
        });

        app.post('/foods', async (req, res) => {
            try {
                const newFood = req.body;
                console.log(newFood)
                const result = await foodCollection.insertOne(newFood);
                res.status(200).send(result);
            } catch (error) {
                res.status(500).send({ error: "Failed to add food" });
            }
        });



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.json('Hello Food World');
})

app.listen(port, () => {
    console.log(`Server is connecting with port ${port}`);
})