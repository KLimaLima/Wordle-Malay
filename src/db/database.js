require('dotenv').config();

const { MongoClient, ServerApiVersion } = require('mongodb');

const credentials = `${process.env.CERT}`

const client = new MongoClient(`mongodb+srv://${process.env.MDB_URL1}.wytow.mongodb.net/?authSource=%24external&authMechanism=${process.env.AUTH_MECH}&retryWrites=true&w=majority&appName=${process.env.MDB_URL2}`, {
  tlsCertificateKeyFile: credentials,
  serverApi: ServerApiVersion.v1
});

module.exports = client