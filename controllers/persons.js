const personsRouter = require('express').Router()
const Person = require('../models/Person')

personsRouter.get('/info', (request, response) => {
  const date = new Date()
  Person.find({}).then(persons => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${date}</p>`)
  })
})

personsRouter.get('/', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

personsRouter.get('/:id', (request, response) => {
  const { id } = request.params

  Person.findById(id).then(person => {
    if (person) {
      response.json(person)
    }

    response.status(404).end()
  }).catch(error => (error))
})

personsRouter.delete('/:id', (request, response, next) => {
  const { id } = request.params

  Person.findByIdAndDelete(id).then(result => {
    response.status(204).end()
  }).catch(error => next(error))
})

personsRouter.post('/', (request, response, next) => {
  const person = request.body

  const newPerson = new Person({
    name: person.name,
    number: person.number
  })

  newPerson.save().then(savedPerson => {
    response.status(201).json(savedPerson)
  }).catch(error => next(error))
})

personsRouter.put('/:id', (request, response, next) => {
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

module.exports = personsRouter
