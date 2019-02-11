// To run this example you need to npm install express, cookie-parser and cookie-session
var express = require('express')
var app = express()
var PatreonOAuth = require('.') // require('patreon-oauth')

var cookieParser = require('cookie-parser')
var cookieSession = require('cookie-session')

app.use(cookieParser())
app.use(cookieSession({ secret: 'ASecretToken' }))

let mockdb = {} // A mock database, use your normal database instead.

var CLIENT_ID = 'Your patreon client ID'
var CLIENT_SECRET = 'Your patreon client secret'
var SCOPE = `users pledges-to-me my-campaign`
var REDIRECT_URL = 'http://localhost/api/patreon/callback'

// Create a new PatreonOAuth object to use
var patreon = new PatreonOAuth(CLIENT_ID, CLIENT_SECRET, SCOPE, REDIRECT_URL)

app.get('/', (req, res) => {
  res.send(`<a href='/patreon/AUserName'>Patreon Login</a>`) // A link for the user to click.
})

app.get('/patreon/:user', (req, res) => {
  req.session.username = req.params.user // Stores the user in a session cookie.
  res.redirect(patreon.AUTH_URL) // Redirects the user to the patreon oauth site.
})

app.get('/api/patreon/callback', (req, res) => {
  patreon.handle(req, (data) => { // Handle the patreon callback stuff
    if (data.error) { res.send(data.error.message); return } // If error, send that.
    mockdb[req.session.username] = data.id // Store the patreon userID in a mock database, replace this with your real database.
    res.redirect('/') // Redirect the user back to /
  })
})

app.get('/patreon/get/:user', (req, res) => {
  res.send({ id: mockdb[req.params.user] }) // Example of getting a users patreon ID from the mock database.
})

app.listen(80)
