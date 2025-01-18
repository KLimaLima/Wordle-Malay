require('dotenv').config();

const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@clusterwordlemalay.wytow.mongodb.net/?retryWrites=true&w=majority&appName=ClusterWordleMalay`;

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

//use cert
const credentials = `${process.env.CERT}`

const client = new MongoClient('mongodb+srv://clusterwordlemalay.wytow.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority&appName=ClusterWordleMalay', {
  tlsCertificateKeyFile: credentials,
  serverApi: ServerApiVersion.v1
});

module.exports = client