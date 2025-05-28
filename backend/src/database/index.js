const { Schema, model } = require('mongoose')
const connectDB = require('./connect')

connectDB()

// schema's

const adminSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: String,
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    transform(doc, ret) {
      delete ret._id
      delete ret.password
      return ret
    }
  }
})

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: String,
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  purchasedCourses: [{
    type: Schema.Types.ObjectId,
    ref: 'Course'
  }]
}, {
  toJSON: {
    transform(doc, ret) {
      delete ret._id
      delete ret.password
      return ret
    }
  }
})

const courseSchema = new Schema({
  title: {
    type: String,
    unique: true,
    required: true
  },
  description: String,
  imageLink: String,
  price: {
    type: Number,
    required: true
  }
})

// model's

const Admin = model('Admin', adminSchema)
const User = model('User', userSchema)
const Course = model('Course', courseSchema)

module.exports = {
  Admin,
  User,
  Course
}