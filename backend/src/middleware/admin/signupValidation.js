const { signupSchema } = require('../../types/zodSchema')

function signupValidation(req, res, next) {
  if (!req.body) {
    res.status(400).json({
      success: false,
      msg: 'Request body not provided'
    })
    return
  }

  const payload = req.body
  const parsedPayload = signupSchema.safeParse(payload)

  if (!parsedPayload.success) {
    res.status(400).json({
      success: false,
      msg: 'Invalid credentials',
      error: parsedPayload.error.flatten().fieldErrors
    })
    return
  }

  req.validatedSignupInput = parsedPayload.data
  next()

  return
}

module.exports = { signupValidation }