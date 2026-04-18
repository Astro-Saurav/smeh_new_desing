const mongoose = require('mongoose')
const { env } = require('./env')

let isConnected = false

async function getPool () {
  if (isConnected) {
    return mongoose.connection
  }

  try {
    await mongoose.connect(env.mongo.uri, {
      dbName: env.mongo.dbName
    })
    
    isConnected = true
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
