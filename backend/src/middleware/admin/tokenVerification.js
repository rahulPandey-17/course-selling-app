const jwt = require('jsonwebtoken')
require('dotenv').config()

function tokenVerification(req, res, next) {
  if (!req.headers.authorization) {
    res.status(400).json({
      success: false,
      msg: 'Request header not provided'
    })
    return
  }

  const token = req.headers.authorization.split(' ')[1]
  const key = process.env.JWT_KEY

  if (!key) {
    res.status(401).json({
      success: false,
      msg: 'JWT key not provided'
    })
    return
  }

  // token verification
  try {
    const decoded = jwt.verify(token, key)
    next()
  } catch(err) {
    res.status(500).json({
      success: false,
      msg: 'Token verification failed',
      error: err
    })
    return
  }

  return
}

module.exports = { tokenVerification }