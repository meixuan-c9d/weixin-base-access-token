const redisClient = require('../configs/redis')
const { promisify } = require('util')

module.exports = async sessionId => {
  const key = 
    `user:` +
    `${sessionId}:` +
    `base_access_token`
  const redisGet = promisify(redisClient.get).bind(redisClient)
  return await redisGet(key)
}