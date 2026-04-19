const { app } = require('./src/app')
const { getPool } = require('./src/config/db')
const { validateEnv } = require('./src/config/env')

module.exports = async (req, res) => {
  try {
    validateEnv()
    await getPool()
    // Vercel Services might pass the path including the prefix
    // but Express handles routing based on /api if we configured it correctly
    return app(req, res)
  } catch (error) {
    console.error('Backend Service Error:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
