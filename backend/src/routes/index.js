const express = require('express')
const { authRouter } = require('./authRoutes')
const { newsRouter } = require('./newsRoutes')
const { categoryRouter } = require('./categoryRoutes')
const { uploadRouter } = require('./uploadRoutes')
const { analyticsRouter } = require('./analyticsRoutes')
const { userRouter } = require('./userRoutes')
const { cronRouter } = require('./cronRoutes')
const { homepageRouter } = require('./homepageRoutes')
const { gridRouter } = require('./gridRoutes')
const { settingsRouter } = require('./settingsRoutes')
const { live, ready, health } = require('../controllers/healthController')

const apiRouter = express.Router()

// ─── Health Endpoints ───────────────────────────────────
apiRouter.get('/live', live)
apiRouter.get('/ready', ready)
apiRouter.get('/health', health)

// ─── Versioned API Routes (v1) ───────────────────────────
apiRouter.use('/v1/auth', authRouter)
apiRouter.use('/v1/news', newsRouter)
apiRouter.use('/v1/categories', categoryRouter)
apiRouter.use('/v1/upload', uploadRouter)
apiRouter.use('/v1/analytics', analyticsRouter)
apiRouter.use('/v1/users', userRouter)
apiRouter.use('/v1/cron', cronRouter)
apiRouter.use('/v1/homepage', homepageRouter)
apiRouter.use('/v1/grids', gridRouter)
apiRouter.use('/v1/settings', settingsRouter)

// ─── Backward-compatible unversioned aliases ──────────────
apiRouter.use('/auth', authRouter)
apiRouter.use('/news', newsRouter)
apiRouter.use('/categories', categoryRouter)
apiRouter.use('/upload', uploadRouter)
apiRouter.use('/analytics', analyticsRouter)
apiRouter.use('/users', userRouter)
apiRouter.use('/cron', cronRouter)
apiRouter.use('/homepage', homepageRouter)
apiRouter.use('/grids', gridRouter)
apiRouter.use('/settings', settingsRouter)

// ─── Category Feed (Dynamic Route) ────────────────────────
const { getFeed } = require('../controllers/categoryController')
apiRouter.get('/v1/category/:slug', getFeed)
apiRouter.get('/category/:slug', getFeed) // unversioned alias

module.exports = { apiRouter }
