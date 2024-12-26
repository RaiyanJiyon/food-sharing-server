const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:5174",
            "https://precious-taffy-271e2b.netlify.app",
        ],
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pkcxb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const verifyJWT = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send({ error: 'Unauthorized access' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ error: 'Forbidden access' });
        }
        req.user = decoded;
        next();
    });
};

async function run() {
    try {
        // await client.connect();

        const foodCollection = client.db("foodDB").collection("foods");

        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5h' });

            res
                .cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
                })
                .send({ success: true })
        });

        app.post('/logout', (req, res) => {
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            })
                .send({ success: true })
        });

        app.get('/foods', async (req, res) => {
            try {
                const query = foodCollection.find();
                const result = await query.toArray();
                res.status(200).send(result);
            } catch (error) {
                res.status(500).send({ error: "Failed to fetch foods" });
            }
        });

        app.get('/featured-foods', async (req, res) => {
            try {
                const result = await foodCollection.find().sort({ foodQuantity: -1 }).limit(6).toArray();
                res.status(200).send(result);
            } catch (error) {
                res.status(500).send({ error: "Failed to fetch featured foods" });
            }
        });

        app.get('/foods/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) };
                const result = await foodCollection.findOne(query);
                res.status(200).send(result);
            } catch (error) {
                res.status(500).send({ error: "Failed to fetch individual foods" });
            }
        });

        app.get('/foods/by-emails/:email', verifyJWT, async (req, res) => {
            try {
                const email = req.params.email;
                const query = { email: email };
                const result = await foodCollection.find(query).toArray();
                res.status(200).send(result);
            } catch (error) {
                res.status(500).send({ error: "Failed to fetch foods by emails" });
            }
        });

        app.post('/foods', verifyJWT, async (req, res) => {
            try {
                const newFood = req.body;
                console.log(newFood);
                const result = await foodCollection.insertOne(newFood);
                res.status(200).send(result);
            } catch (error) {
                res.status(500).send({ error: "Failed to add food" });
            }
        });

        app.put('/foods/:id', verifyJWT, async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updatedFoods = req.body;
            console.log(updatedFoods);
            const food = {
                $set: {
                    foodName: updatedFoods.foodName,
                    foodUrl: updatedFoods.foodUrl,
                    foodQuantity: updatedFoods.foodQuantity,
                    pickupLocation: updatedFoods.pickupLocation,
                    expiredDate: updatedFoods.expiredDate,
                    additionalNotes: updatedFoods.additionalNotes,
                    foodStatus: updatedFoods.foodStatus,
                    requestDate: updatedFoods.requestDate, // Added requestDate
                    requestedBy: updatedFoods.requestedBy, // Added requestedBy
                },
            };
            try {
                const result = await foodCollection.updateOne(filter, food);
                res.status(200).send(result);
            } catch (error) {
                res.status(500).send({ error: "Failed to update food" });
            }
        });
        

        app.delete('/foods/:id', verifyJWT, async (req, res) => {
            try {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) };
                const result = await foodCollection.deleteOne(query);
                if (result.deletedCount === 1) {
                    res.status(200).send(result);
                } else {
                    res.status(404).send({ error: "Food item not found" });
                }
            } catch (error) {
                res.status(500).send({ error: "Failed to delete individual food" });
            }
        });

        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.json('Hello Food World');
});

app.listen(port, () => {
    console.log(`Server is connecting with port ${port}`);
});
