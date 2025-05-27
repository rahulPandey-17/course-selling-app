const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors())


app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`)
})