var url = require('url')
const patreon = require('patreon')
const patreonAPI = patreon.patreon
const patreonOAuth = patreon.oauth

class PatreonOAuth {
  constructor (CLIENT_ID, CLIENT_SECRET, SCOPE, REDIRECT_URL) {
    this.CLIENT_ID = CLIENT_ID
    this.CLIENT_SECRET = CLIENT_SECRET
    this.SCOPE = SCOPE
    this.REDIRECT_URL = REDIRECT_URL
    this.AUTH_URL = `https://www.patreon.com/oauth2/authorize?response_type=code&state=chill&redirect_uri=${encodeURIComponent(this.REDIRECT_URL)}&scope=${encodeURIComponent(this.SCOPE)}&client_id=${encodeURIComponent(this.CLIENT_ID)}`
    this.oauthClient = patreonOAuth(CLIENT_ID, CLIENT_SECRET)
  }

  handle (request, response) {
    var oauthGrantCode = url.parse(request.url, true).query.code

    if (!oauthGrantCode) response({ error: new Error('User denied authentication.') })

    this.oauthClient
      .getTokens(oauthGrantCode, this.REDIRECT_URL)
      .then(function (tokensResponse) {
        var patreonAPIClient = patreonAPI(tokensResponse.access_token)
        return patreonAPIClient('/current_user')
      })
      .then(function (result) {
        response(result.rawJson.data)
      })
      .catch(function (err) {
        response({ error: err })
      })
  }
}

module.exports = PatreonOAuth
