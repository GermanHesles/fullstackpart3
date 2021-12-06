const { request, response } = require('express')
const e = require('express')
const express = require('express')
const app = express()

app.use(express.json())

let persons = [
  {
    "name": "Arto Hellas",
    "number": "546- 765534",
    "userId": 1,
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "896-563222",
    "userId": 1,
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "userId": 1,
    "id": 3
  },
  {
    "name": "Alan Turing",
    "number": "41-32- 486346",
    "userId": 1,
    "id": 4
  },
  {
    "name": "Charles Bowl",
    "number": "321-486346",
    "userId": 1,
    "id": 5
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
    console.log(person)
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

  const ids = persons.map(person => person.id)
  const maxId = Math.max(...ids)

  const newPerson = {
    id: maxId + 1,
    name: person.name,
    number: person.number,
    userId: 1
  }

  persons = [...persons, newPerson]

  response.json(newPerson)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
