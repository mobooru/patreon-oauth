# Patreon OAuth
A simple wrapper around the Patreon API.
___
## Install
```
npm i --save patreon-oauth
```

## Usage
```js
const PatreonOAuth = require('patreon-oauth')
const patreon = new PatreonOAuth(CLIENT_ID, CLIENT_SECRET, SCOPE, REDIRECT_URL)

app.get('/auth/patreon', (req, res) => {
  res.redirect(patreon.AUTH_URL) // Redirects the user to the patreon oauth.
})

app.get('/auth/patreon/callback', (req, res) => {
  patreon.handle(req, (data) => {
    res.send(data) // Returns the patreon user object to the user.
  })
})
```