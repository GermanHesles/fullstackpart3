require('dotenv').config()
require('./mongo')
const cors = require('cors')
const express = require('express')
const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')
const logger = require('./middleware/loggerMiddleware')
const notFound = require('./middleware/notFound')
const errorHandler = require('./middleware/errorHandler')
const personsRouter = require('./controllers/persons')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const app = express()

Sentry.init({
  dsn: 'https://cc224866d6d6482dbfd22a85505542e3@o1169612.ingest.sentry.io/6262658',
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app })
  ],

  tracesSampleRate: 1.0
})

app.use(Sentry.Handlers.requestHandler())
app.use(Sentry.Handlers.tracingHandler())
app.use(express.static('build'))
app.use(express.json())
app.use(logger)
app.use(cors())
app.use('/api/persons', personsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.get('/debug-sentry', function mainHandler (req, res) {
  throw new Error('My first Sentry error!')
})

app.use(Sentry.Handlers.errorHandler())
app.use(errorHandler)
app.use(notFound)

module.exports = { app }
