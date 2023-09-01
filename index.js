const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();


//middleware

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6dr6mlt.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)

//  const uri = `mongodb+srv://wedding:zQPqVeg4YPLVziGx@cluster0.6dr6mlt.mongodb.net/?retryWrites=true&w=majority`;



const client = new MongoClient(uri,  {
  serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
  }
}
);




async function run() {
  try {
    await client.connect();
    const servicesCollection = client.db('wedding').collection('services');
    const photosCollection = client.db('wedding').collection('photos');
    const bookingsCollection = client.db('wedding').collection('bookings');
    // const usersCollection = client.db('wedding').collection('users');
    console.log('connected to mongodb')
  

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

      app.get('/photos', async (req, res) => {
        const query = {};
        const cursor = photosCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
      });
      app.post('/photos', async (req, res) => {
        const photos = req.body;
        const result = await photosCollection.insertOne(photos);
        res.send(result);
      })

      app.post('/bookings', async (req, res) => {
        const bookings = req.body;
        const result = await bookingsCollection.insertOne(bookings);
        res.send(result);
      })

      

      app.get('/bookings', async (req, res) => {
        const email = req.query.email;
        const query = { email: email };
        const bookings = await bookingsCollection.find(query).toArray();
        res.send(bookings);
      })
      app.get('/bookings/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const booking = await bookingsCollection.findOne(query);
        res.send(booking);
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