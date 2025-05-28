const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

const adminRoutes = require('./routes/admin/admin')
const userRoutes = require('./routes/user/user')

const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors())

// all routes
app.use('/admin', adminRoutes)
app.use('/user', userRoutes)

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`)
})