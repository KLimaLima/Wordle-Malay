require('dotenv').config();

const express = require('express');
const app = express()
const port = process.env.PORT || 3000;

let client = require('./db/database')
let limiter = require('./utils/rate-limit')

const { day_interval } = require('./server/day-interval')
const { insert_random } = require('./server/insert-random')
const { delete_all_gamedata } = require('./server/delete-all-gamedata')

app.set('trust proxy', true)

app.use(express.json())
app.use(limiter)

const registerRouter = require('./account/register')
const loginRouter = require('./account/login')
const word_listRouter = require('./word/edit')
const today_wordRouter = require('./word/today')
const gameRouter = require('./game/game')
const ipRouter = require('./dev/ip-route')
const leaderboardRouter = require('./game/leaderboard')

app.use('/account', registerRouter)
app.use('/account', loginRouter)
app.use('/word', word_listRouter)
app.use('/word', today_wordRouter)
app.use('/', gameRouter)
app.use('/', ipRouter)
app.use('/', leaderboardRouter)

app.use((req, res) => {
  res.status(200).send('home')
})

// for start and just in case undefined for any reason
if(saved_date == null) {

  var saved_date = new Date()
}

// has a day passed
if(day_interval(saved_date)) {
  
  //randomly pick a new word
  insert_random()

  //delete yesterday's game data
  delete_all_gamedata()

  // since already one day, get change var to today's date
  saved_date = new Date()
}

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
     console.log("This shows that the server can connect to our database with the use of x.509 certificate")
   } finally {
     // Ensures that the client will close when you finish/error
     // await client.close();
   }
 }
 run().catch(console.dir);