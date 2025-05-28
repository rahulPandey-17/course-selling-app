const router = require('express').Router()
require('dotenv').config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { signupValidation } = require('../../middleware/admin/signupValidation')
const { loginValidation } = require('../../middleware/admin/loginValidation')
const { tokenVerification } = require('../../middleware/admin/tokenVerification')
const { Admin, Course } = require('../../database/index')
const { courseValidation } = require('../../middleware/admin/courseValidation')
const { MongoServerError } = require('mongoose').mongo

const serverMessage = 'Something went wrong, please try again'

// signup endpoint
router.post('/signup', signupValidation, async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.validatedSignupInput
    const hashedPassword = await bcrypt.hash(password, 10)
    const newAdmin = await Admin.create({
      firstName,
      lastName,
      email,
      password: hashedPassword
    })

    res.status(201).json({
      success: true,
      msg: 'Admin created successfully',
      admin: newAdmin
    })
    return
  } catch(err) {
    if (err instanceof MongoServerError && err.code === 11000) {
      res.status(409).json({
        success: false,
        msg: 'Admin with this email already exists, try again'
      })
      return
    }

    res.status(500).json({
      success: false,
      msg: serverMessage,
      error: err
    })
    return
  }
})

// login endpoint
router.post('/login', loginValidation, async (req, res) => {
  try {
    const { email, password } = req.validatedLoginInput
    const admin = await Admin.findOne({ email })

    if (!admin) {
      res.status(400).json({
        success: false,
        msg: 'Invalid email or password'
      })
      return
    }

    const checkPassword = await bcrypt.compare(password, admin.password)

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

    const { _id, firstName } = admin
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

// course creation endpoint
router.post('/courses', tokenVerification, courseValidation, async (req, res) => {
  try {
    const { title, description, imageLink, price } = req.validatedCourseInput
    const newCourse = await Course.create({
      title,
      description,
      imageLink,
      price
    })

    res.status(201).json({
      success: true,
      msg: 'Course created successfully',
      courseId: newCourse._id
    })
    return
  } catch(err) {
    if (err instanceof MongoServerError && err.code === 11000) {
      res.status(409).json({
        success: false,
        msg: 'Course with this title already exists'
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

// retrieve courses endpoint
router.get('/courses', tokenVerification, async (req, res) => {
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

module.exports = router