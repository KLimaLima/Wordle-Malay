const express = require('express');
const app = express()
const port = process.env.PORT || 3000;

let client = require('./db/database')

app.use(express.json())

const registerRouter = require('./account/register')
const loginRouter = require('./account/login')

app.use('/account', registerRouter)
// app.use('/account', loginRouter)

app.get('/', (req, res) => {
   res.send('Hello World!')
})

app.listen(port, () => {
   console.log(`Example app listening on port ${port}`)
})

async function run() {
   try {
     // Connect the client to the server	(optional starting in v4.7)
     await client.connect();
     // Send a ping to confirm a successful connection
     await client.db("admin").command({ ping: 1 });
     console.log("Pinged your deployment. You successfully connected to MongoDB!");
   } finally {
     // Ensures that the client will close when you finish/error
     //await client.close();
   }
 }
 run().catch(console.dir);