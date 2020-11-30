const debug = require('../configs/debug')
const redisClient = require('../configs/redis')
const { promisify } = require('util')

module.exports = async ({
  sessionId,
  baseAccessToken,
  baseAccessTokenTTL
}) => {
  const redisSet = promisify(redisClient.set).bind(redisClient)
  redisSet(
    `user:${sessionId}:base_access_token`, 
    baseAccessToken, 
    'EX',
    baseAccessTokenTTL
  )
    .then(result => {
      debug.log(`
        set base access token
        result ${result}
      `)
    })
    .catch(error => {
      debug.error(`
        set base access token failed
        ${error}
      `)
      
    })
}