const express = require('express')
const { authRouter } = require('./authRoutes')
const { newsRouter } = require('./newsRoutes')
const { categoryRouter } = require('./categoryRoutes')
const { uploadRouter } = require('./uploadRoutes')
const { analyticsRouter } = require('./analyticsRoutes')
const { userRouter } = require('./userRoutes')

const apiRouter = express.Router()

apiRouter.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

apiRouter.use('/auth', authRouter)
apiRouter.use('/news', newsRouter)
apiRouter.use('/categories', categoryRouter)
apiRouter.use('/upload', uploadRouter)
apiRouter.use('/analytics', analyticsRouter)
apiRouter.use('/users', userRouter)

module.exports = {
  apiRouter
}
