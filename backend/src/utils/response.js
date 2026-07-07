/**
 * Standard API Response Helpers
 * All responses follow the unified contract:
 * {
 *   success: boolean,
 *   message: string,
 *   data: object | null,
 *   meta: object | null,
 *   errors: array | null
 * }
 */

function success (res, data = null, message = 'Success', statusCode = 200, meta = null) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta: meta || undefined,
    errors: undefined
  })
}

function created (res, data = null, message = 'Created successfully') {
  return success(res, data, message, 201)
}

function paginated (res, items, pagination, message = 'Success') {
  return success(res, items, message, 200, {
    page: pagination.page,
    limit: pagination.limit,
    total: pagination.total,
    totalPages: pagination.totalPages,
    hasNext: pagination.page < pagination.totalPages,
    hasPrev: pagination.page > 1
  })
}

function noContent (res) {
  return res.status(204).send()
}

function error (res, message = 'An error occurred', statusCode = 500, errors = null) {
  return res.status(statusCode).json({
    success: false,
    message,
    data: undefined,
    meta: undefined,
    errors: errors || undefined
  })
}

function validationError (res, errors = [], message = 'Validation failed') {
  return error(res, message, 422, errors)
}

function notFound (res, message = 'Resource not found') {
  return error(res, message, 404)
}

function unauthorized (res, message = 'Unauthorized') {
  return error(res, message, 401)
}

function forbidden (res, message = 'Forbidden') {
  return error(res, message, 403)
}

function conflict (res, message = 'Conflict') {
  return error(res, message, 409)
}

module.exports = {
  success,
  created,
  paginated,
  noContent,
  error,
  validationError,
  notFound,
  unauthorized,
  forbidden,
  conflict
}
