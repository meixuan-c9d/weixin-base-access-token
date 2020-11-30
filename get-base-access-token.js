const debug = require('./configs/debug')
const wrap = require('./utils/wrap')
const fetchLocalBaseAccessToken = require('./libs/fetch-local-base-access-token')
const fetchNewBaseAccessToken = require('./libs/fetch-new-base-access-token')
const checkIfLocalBaseAccessTokenFound = require('./libs/check-if-local-base-access-token-found')

module.exports = wrap(async (request, response, next) => {
  const sessionId = request.params.sessionId
  debug.log(`
  received sessionId ${sessionId}
  `)
  const ifLocalBaseAccessTokenFound = await checkIfLocalBaseAccessTokenFound(sessionId)
  
  if (ifLocalBaseAccessTokenFound !== false) {
    const ttlBaseAccessToken = ifLocalBaseAccessTokenFound
    if (ttlBaseAccessToken <= +process.env.TTL_LOWER_LIMIT_BASE_ACCESS_TOKEN) {
      debug.log(`
        cached base access will expire in ${process.env.LOWER_LIMIT_BASE_ACCESS_TOKEN}s
        fetching new one
      `)
      await fetchNewBaseAccessToken(request, response)
    } else {
      const baseAccessToken = await fetchLocalBaseAccessToken(sessionId)
      debug.log(`
        using cached base access token
        ${baseAccessToken}
      `)
      response.json({
        baseAccessToken
      })
    }
  } else {
    await fetchNewBaseAccessToken(request, response)
  }

})