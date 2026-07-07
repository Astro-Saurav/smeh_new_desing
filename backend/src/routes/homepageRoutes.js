const express = require('express')
const { getHomepage } = require('../controllers/homepageController')

const homepageRouter = express.Router()

homepageRouter.get('/', getHomepage)

module.exports = { homepageRouter }
