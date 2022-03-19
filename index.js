require('dotenv').config()
require('./mongo')
const cors = require('cors')
const express = require('express')
const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')
const logger = require('./middleware/loggerMiddleware')
const Person = require('./models/Person')
const notFound = require('./middleware/notFound')
const handleError = require('./middleware/handleError')

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

app.get('/debug-sentry', function mainHandler (req, res) {
  throw new Error('My first Sentry error!')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
  const date = new Date()
  Person.find({}).then(persons => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${date}</p>`)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  const { id } = request.params

  Person.findById(id).then(person => {
    if (person) {
      response.json(person)
    }

    response.status(404).end()
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const { id } = request.params

  Person.findByIdAndDelete(id).then(result => {
    response.status(204).end()
  }).catch(error => next(error))

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const person = request.body

  if (!person.name || !person.number) {
    return response.status(422).json({
      error: 'The name or number is missing'
    })
  }

  /*   const personExists = persons.some(
    existingPerson => existingPerson.name === person.name
  )

  if (personExists) {
    return response.status(409).json({
      error: 'Name must be unique',
      person: personExists
    })
  } */

  const newPerson = new Person({
    name: person.name,
    number: person.number
  })

  newPerson.save().then(savedPerson => {
    response.json(savedPerson)
  })
  response.status(201).json(newPerson)
})

app.put('/api/persons/:id', (request, response, next) => {
  const { id } = request.params
  const person = request.body

  const updatedPerson = {
    name: person.name,
    number: person.number
  }

  Person.findByIdAndUpdate(id, updatedPerson, { new: true }).then(result => {
    response.json(result).end()
  })
})

app.use(Sentry.Handlers.errorHandler())
app.use(handleError)
app.use(notFound)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
