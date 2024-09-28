const express = require('express')
const { MongoClient } = require('mongodb')
const dotenv = require('dotenv')
const bodyparser = require('body-parser')
const cors = require('cors')

const app = express()
const port = 3000
const serverType = "http"

dotenv.config()
app.use(cors())
app.use(bodyparser.json())

// Connection URL
const url = 'mongodb://localhost:27017'
const client = new MongoClient(url)
client.connect();
const dbName = 'secureit';

// get all passwords
app.get('/', async (req, res) => {
    // mongo process
    const db = client.db(dbName)
    const collection = db.collection('passwords')
    const findResult = await collection.find({}).toArray();
    res.json(findResult)
})

// post password by save
app.post('/', async (req, res) => {
    // mongo process
    const password = req.body
    const db = client.db(dbName)
    const collection = db.collection('passwords')
    const findResult = await collection.insertOne(password)
    res.send({ success: true, result: findResult })
})

// delete a password
app.delete('/', async (req, res) => {
    // mongo process
    const password = req.body
    const db = client.db(dbName)
    const collection = db.collection('passwords')
    const findResult = await collection.deleteOne(password)
    res.send({ success: true, result: findResult })
})

// Listen on port get app
app.listen(port, () => {
    console.log(`App listening on port ${port} -`, `${serverType}://localhost:${port}`)
})
