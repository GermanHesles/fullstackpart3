const cors = require('cors')
const express = require('express')
const app = express()
const logger = require('./loggerMiddleware')

app.use(express.static('build'))

app.use(express.json())

app.use(logger)

app.use(cors())

let persons = [
  {
    'name': 'Arto Hellas',
    'number': '546- 765534',
    'userId': 1,
    'id': 1
  },
  {
    'name': 'Ada Lovelace',
    'number': '896-563222',
    'userId': 1,
    'id': 2
  },
  {
    'name': 'Dan Abramov',
    'number': '12-43-234345',
    'userId': 1,
    'id': 3
  },
  {
    'name': 'Alan Turing',
    'number': '41-32- 486346',
    'userId': 1,
    'id': 4
  },
  {
    'name': 'John Dee',
    'number': '321-486346',
    'userId': 1,
    'id': 5
  }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  var dat= new Date()
  response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${dat}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  }

  response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const person = request.body

  if (!person.name || !person.number) {
    return response.status(422).json({
      error: 'The name or number is missing'
    })
  }

  const personExists = persons.some(
    existingPerson => existingPerson.name === person.name
  )

  if (personExists) {
    return response.status(409).json({
      error: 'Name must be unique',
      person: personExists
    })
  }

  const ids = persons.map(person => person.id)
  const maxId = Math.max(...ids)

  const newPerson = {
    id: maxId + 1,
    name: person.name,
    number: person.number,
    userId: 1
  }

  persons = [...persons, newPerson]

  response.status(201).json(newPerson)
})

app.put('/api/persons/:id', (request, response) => {
  const updatedPerson = request.body
  const id = Number(request.params.id)
  const updatedPersons = [];

  persons.forEach((person, i) => {
    updatedPersons[i] = person;

    if (person.id === id) {
      updatedPersons[i] = {...person, ...updatedPerson};
    }
  })

  persons = updatedPersons

  response.status(201)
})

app.use((request, response) => {
  response.status(404).json({
    error: 'Not found'
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
