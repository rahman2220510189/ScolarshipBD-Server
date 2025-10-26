const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cjuyyb2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        //Find scholarship related apis

        const findScholarship = client.db('scholarshipBD').collection('findScholarship');
        const apply = client.db('scholarshipBD').collection('apply');
        const news = client.db('scholarshipBD').collection('news');
        const winners = client.db('scholarshipBD').collection('winner');
        const internship = client.db('scholarshipBD').collection('internship');
        const featuredInternship = client.db('scholarshipBD').collection('job');
        const applyInternship = client.db('scholarshipBD').collection('internship_post');
        const jobs = client.db('scholarshipBD').collection('jobs');

        app.get('/findScholarship', async (req, res) => {
            const scholarship = await findScholarship.find().toArray();
            res.send(scholarship);
        });

        app.post('/apply', async(req, res) =>{
            const formData = req.body;
            const result = await apply.insertOne(formData);
            res.send({success: true, insertedId: result.insertedId});
        });
        
        app.get('/news', async(req, res) =>{
            const scholarshipNews = await news.find().toArray();
            res.send(scholarshipNews);
        });

        app.get('/winner', async(req, res)=>{
            const winner = await winners.find().toArray();
            res.send(winner);
        });
        app.get('/internship', async(req, res) =>{
            const internships = await internship.find().toArray();
            res.send(internships);
        });
        app.get('/job', async(req, res) =>{
            const jobs = await featuredInternship.find().toArray();
            res.send(jobs);
        });

        app.post('/apply_internship', async(req, res) =>{
            const formData = req.body;
            const result = await applyInternship.insertOne(formData);
            res.send({success: true, insertedId: result.insertedId});
        });

        app.get('/jobs', async(req, res) =>{
        const jobss = await jobs.find().toArray();
        res.send(jobss);
      
        });
        app.post('/apply_job', async(req, res) =>{
            const data = req.body;
            const result = await applyInternship.insertOne(data);
            res.send(result);
        });

    } finally {
        // // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Scholarship is falling in the Scholarship BD');
});

app.listen(port, () => {
    console.log(`scholarship is waiting for you: ${port}`)
});
