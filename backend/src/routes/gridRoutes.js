const express = require('express')
const { getGrids, getGrid, createGridHandler, updateGridHandler, deleteGridHandler } = require('../controllers/gridController')
const { authenticate, authorize } = require('../middleware/authMiddleware')

const gridRouter = express.Router()

// Public read
gridRouter.get('/', getGrids)
gridRouter.get('/:id', getGrid)

// Admin-only mutations
gridRouter.post('/', authenticate, authorize('admin', 'editor'), createGridHandler)
gridRouter.put('/:id', authenticate, authorize('admin', 'editor'), updateGridHandler)
gridRouter.delete('/:id', authenticate, authorize('admin'), deleteGridHandler)

module.exports = { gridRouter }
