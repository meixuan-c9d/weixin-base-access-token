const debug = require('../configs/debug')
const querystring = require('querystring')
const fetch = require('node-fetch')
const cacheBaseAccessToken = require('./cache-base-access-token')

module.exports = async (request, response) => {
  const responseFetch = await fetch(
    `${process.env.WEIXIN_API_BASE_ACCESS_TOKEN}?` +
    querystring.stringify({
      grant_type: 'client_credential',
      // appid: process.env.NODE_ENV === 'production'
      //   ? process.env.WEIXIN_APP_ID
      //   : process.env.WEIXIN_APP_ID_DEV,
      // secret: process.env.NODE_ENV === 'production'
      //   ? process.env.WEIXIN_APP_SECRET
      //   : process.env.WEIXIN_APP_SECRET_DEV
      appid: process.env.WEIXIN_APP_ID,
      secret: process.env.WEIXIN_APP_SECRET
    })
  )
  const responseConcat = await responseFetch.json()
  debug.log(responseConcat)

  if (responseConcat.errcode === undefined) {
    if (
      responseConcat.access_token === undefined ||
      responseConcat.expires_in === undefined
    ) {
      throw new Error(`
        expected key not found
        received ${responseConcat}
      `)
    } 
    const sessionId = request.params.sessionId
    const {
      access_token: baseAccessToken,
      expires_in: baseAccessTokenTTL
    } = responseConcat
    cacheBaseAccessToken({
      sessionId,
      baseAccessToken,
      baseAccessTokenTTL
    })
    return response.json({
      baseAccessToken
    })
  }

  const {
    errcode,
    errmsg
  } = responseConcat

  throw new Error(`
    error fetching base access_token
    errcode ${errcode}
    errmsg ${errmsg}
  `)
}