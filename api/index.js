const { app } = require('../backend/src/app')
const { getPool } = require('../backend/src/config/db')
const { validateEnv } = require('../backend/src/config/env')

module.exports = async (req, res) => {
  try {
    // Ensure environment variables are valid
    validateEnv()
    
    // Ensure DB is connected
    await getPool()
    
    // Let Express handle the request
    return app(req, res)
  } catch (error) {
    console.error('Serverless Function Error:', error)
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    })
  }
}
