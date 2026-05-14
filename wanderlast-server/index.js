//const dns = require("node:dns");
//dns.setServers(["8.8.8.8", "8.8.4.4"]);


const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
dotenv.config();
const uri = process.env.MONGODB_URI;


const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function run() {
    try {

        await client.connect();


        const db = client.db("wanderlust");
        const destinationsCollection = db.collection("destinations");
        const bookingCollection = db.collection("booking")


        app.get('/destination', async (req, res) => {

            const result = await destinationsCollection.find().toArray();

            res.json(result);
        })


        app.post('/destination', async (req, res) => {

            const destinationData = req.body;

            // console.log(destinationData)
            const result = await destinationsCollection.insertOne(destinationData);

            res.json(result);
        })



        app.get('/destination/:id', async (req, res) => {

            const { id } = req.params;

            const result = await destinationsCollection.findOne({ _id: new ObjectId(id) });

            res.json(result);
        })


        app.patch('/destination/:id', async (req, res) => {

            const { id } = req.params;
            const updatedData = req.body;
            console.log(updatedData)

            const result = await destinationsCollection.updateOne(

                { _id: new ObjectId(id) },
                {$set: updatedData}
            );

            res.json(result);
        })





        app.delete('/destination/:id', async (req, res) => {

            const { id } = req.params;

            const result = await destinationsCollection.deleteOne({ _id: new ObjectId(id) });

            res.json(result);
        })








        //booking collection

        app.get('/booking/:userId', async (req, res) => {

            const { userId } = req.params;

            const result = await bookingCollection.find({userId}).toArray();

            res.json(result);
        })


        app.post('/booking', async (req, res) => {

            const bookingData = req.body;

            
            const result = await bookingCollection.insertOne(bookingData);

            res.json(result);
        })



        app.delete('/booking/:bookingId', async (req, res) => {

            const { bookingId } = req.params;

            const result = await bookingCollection.deleteOne({ _id: new ObjectId(bookingId) });

            res.json(result);
        })




        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})