const { z } = require('zod')

// admin and user signup schema
const signupSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().max(150).optional(),
  email: z.string().email().min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be atlease 6 characters long')
})

// admin and user login schema
const loginSchema = z.object({
  email: z.string().email().min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be atlease 6 characters long')
})

// course schema
const courseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(200).optional(),
  imageLink: z.string(),
  price: z.number().int().positive().finite()
})

module.exports = {
  signupSchema,
  loginSchema,
  courseSchema
}