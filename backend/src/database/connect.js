const mongoose = require('mongoose')
require('dotenv').config()

const database_uri = process.env.DATABASE_URI

async function connectBD() {
  try {
    await mongoose.connect(database_uri)
    console.log('Database connection successful')
  } catch(err) {
    console.error('Database connection failed', err)
    process.exit(1)
  }
}

module.exports = connectBD