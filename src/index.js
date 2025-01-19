const express = require('express');
const app = express()
const port = process.env.PORT || 3000;

let client = require('./db/database')
let limiter = require('./utils/rate-limit')

const { day_interval } = require('./server/day-interval')
const { insert_random } = require('./server/insert-random')
const { delete_all_gamedata } = require('./server/delete-all-gamedata')

/////////////////////////////////////////////////////////////////////////////

const { ip_addr } = require('./db/client');

let proxy_num = await ip_addr.findOne(
  {
    parameter: 'proxy_num'
  }
)

app.set('trust proxy', true)//proxy_num.num)

/////////////////////////////////////////////////////////////////////////////

app.use(express.json())
app.use(limiter)

const registerRouter = require('./account/register')
const loginRouter = require('./account/login')
const word_listRouter = require('./word/edit')
const today_wordRouter = require('./word/today')
const gameRouter = require('./game/game')
const ipRouter = require('./dev/ip-route')
const proxyNum = require('./dev/proxy-num')
const leaderboardRouter = require('./game/leaderboard')

app.use('/account', registerRouter)
app.use('/account', loginRouter)
app.use('/word', word_listRouter)
app.use('/word', today_wordRouter)
app.use('/', gameRouter)
app.use('/', ipRouter)
app.use('/', proxyNum)
app.use('/', leaderboardRouter)

app.use((req, res) => {
  res.status(200).send('home')
})

// daily_word()
if(day_interval()) {
  
  //randomly pick a new word
  insert_random()

  //delete yesterday's game data
  delete_all_gamedata()
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
   } finally {
     // Ensures that the client will close when you finish/error
     //await client.close();
   }
 }
 run().catch(console.dir);