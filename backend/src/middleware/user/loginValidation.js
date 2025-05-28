const { loginSchema } = require('../../types/zodSchema')

function loginValidation(req, res, next) {
  if (!req.body) {
    res.status(400).json({
      success: false,
      msg: 'Request body not provided'
    })
    return
  }

  const payload = req.body
  const parsedPayload = loginSchema.safeParse(payload)

  if (!parsedPayload.success) {
    res.status(400).json({
      success: false,
      msg: 'Invalid credentials'
    })
    return
  }

  req.validatedLoginInput = parsedPayload.data
  next()

  return
}

module.exports = { loginValidation }