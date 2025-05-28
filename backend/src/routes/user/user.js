const router = require('express').Router()
const bcrypt = require('bcrypt')
const { MongoServerError } = require('mongoose').mongo
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const { User, Course } = require('../../database/index')
const { signupValidation } = require('../../middleware/user/signupValidation')
const { loginValidation } = require('../../middleware/user/loginValidation')
const { tokenValidation } = require('../../middleware/user/tokenValidation')

const serverMessage = 'Something went wrong, please try again'

// user signup endpoint
router.post('/signup', signupValidation, async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.validatedUserSignupPayload
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword
    })

    res.status(201).json({
      success: true,
      msg: 'User created successfully',
      user: newUser
    })
    return
  } catch(err) {
    if (err instanceof MongoServerError && err.code === 11000) {
      res.status(409).json({
        success: false,
        msg: 'User with this email already exists, try another'
      })
      return
    }

    res.status(500).json({
      success: false,
      msg: serverMessage,
      error: err.message
    })
    return
  }
})

// user login endpoint
router.post('/login', loginValidation, async (req, res) => {
  try {
    const { email, password } = req.validatedLoginInput
    const user = await User.findOne({ email })

    if (!user) {
      res.status(400).json({
        success: false,
        msg: 'Invalid email or password'
      })
      return
    }

    const checkPassword = await bcrypt.compare(password, user.password)

    if (!checkPassword) {
      res.status(400).json({
        success: false,
        msg: 'Invalid email or password'
      })
      return
    }

    // issuing jwt
    const key = process.env.JWT_KEY

    if (!key) {
      res.status(401).json({
        success: false,
        msg: 'JWT key not provided'
      })
      return
    }

    const { _id, firstName } = user
    const token = jwt.sign({ _id, firstName, email }, key, { expiresIn: '1d' })

    res.status(200).json({
      success: true,
      msg: 'Login successful',
      yourToken: token
    })
    return
  } catch(err) {
    res.status(500).json({
      success: false,
      msg: serverMessage,
      error: err.message
    })
    return
  }
})

// get courses endpoint
router.get('/courses', tokenValidation, async (req, res) => {
  try {
    const allCourses = await Course.find({})

    res.status(200).json({
      success: true,
      msg: 'Course retrieval successful',
      courses: allCourses
    })
    return
  } catch(err) {
    res.status(500).json({
      success: false,
      msg: serverMessage,
      error: err.message
    })
    return
  }
})

// purchase course endpoint
router.post('/courses/:courseId', tokenValidation, async (req, res) => {
  try {
    const courseId = req.params.courseId
    const objectId = mongoose.Types.ObjectId.createFromHexString(courseId)
    const userId = req.decodedUserId
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { purchasedCourses: objectId } },
      { new: true }
    )

    res.status(200).json({
      success: true,
      msg: 'Course added successfully',
      addedCourse: user.purchasedCourses
    })
    return
  } catch(err) {
    res.status(500).json({
      success: false,
      msg: serverMessage,
      error: err.message
    })
    return
  }
})

// see purchased courses endpoint
router.get('/purchasedCourses', tokenValidation, async (req, res) => {
  try {
    const userId = req.decodedUserId
    const user = await User.findOne({ _id: userId }).populate({
      path: 'purchasedCourses',
      select: 'title description -_id'
    })

    res.status(200).json({
      success: true,
      msg: 'Purchased courses retrieval successful',
      courses: user.purchasedCourses
    })
    return
  } catch(err) {
    res.status(500).json({
      success: false,
      msg: serverMessage,
      error: err.message
    })
    return
  }
})

module.exports = router