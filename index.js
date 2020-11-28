require('dotenv').config()
const debug = require('./configs/debug')
const express = require('express')
const app = express()

const getBaseAccessToken = require('./get-base-access-token')

app
  .route('/:sessionId')
  .get(getBaseAccessToken)

  app.listen(process.env.LISTEN_PORT, () => {
  debug.log(`base_access_token service running at ${process.env.LISTEN_PORT}`)
})