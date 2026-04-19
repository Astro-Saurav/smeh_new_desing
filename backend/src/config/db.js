const mongoose = require('mongoose')
const { env } = require('./env')

let isConnected = false

async function getPool () {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection
  }

  try {
    await mongoose.connect(env.mongo.uri, {
      dbName: env.mongo.dbName
    })
    console.log('Connected to MongoDB/CosmosDB')
    return mongoose.connection
  } catch (error) {
    console.error('Database connection error:', error)
    throw error
  }
}

module.exports = {
  getPool
}

