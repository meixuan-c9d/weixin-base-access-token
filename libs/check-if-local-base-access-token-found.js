const debug = require('../configs/debug')
const redisClient = require('../configs/redis')
const { promisify } = require('util')

module.exports = async sessionId => {
  const key = 
    `user:` +
    `${sessionId}:` +
    `base_access_token`

  const redisTtl = promisify(redisClient.ttl).bind(redisClient)
  const ttl = await redisTtl(key)

  debug.log(`
    ttl of current base access token ${ttl}
  `)

  if (ttl === -2) {
    return false
  } else {
    return ttl
  }
}