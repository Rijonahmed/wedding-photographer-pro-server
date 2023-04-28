const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');




//middleware

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6dr6mlt.mongodb.net/?retryWrites=true&w=majority`;

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kpl5w4z.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function run() {
  try {
    await client.connect();
    const servicesCollection = client.db('wedding').collection('services');
    const usersCollection = client.db('wedding').collection('users');

    app.get('/services', async (req, res) => {
        const query = {};
        const cursor = servicesCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
      });

      app.get('/services/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const service = await servicesCollection.findOne(query);
        res.send(service);
      });


  }
  finally {

  }

}

run().catch(console.dir)



app.get('/', (req, res) => {
  res.send('running wedding photographer server')
});

app.listen(port, () => {
  console.log('listening to port', port)
})