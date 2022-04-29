const personsRouter = require('express').Router()
const Person = require('../models/Person')

personsRouter.get('/info', async (request, response) => {
  const date = new Date()
  const persons = await Person.find({})
  response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${date}</p>`)
})

personsRouter.get('/', async (request, response) => {
  const persons = await Person.find({})
  response.json(persons)
})

personsRouter.get('/:id', async (request, response, next) => {
  const { id } = request.params
  try {
    const person = await Person.findById(id)
    if (person) {
      response.json(person)
    }

    response.status(404).end()
  } catch (error) {
    next(error)
  }
})

personsRouter.delete('/:id', async (request, response, next) => {
  const { id } = request.params

  try {
    await Person.findByIdAndDelete(id)
    response.status(200).end()
  } catch (error) {
    next(error)
  }
})

personsRouter.post('/', async (request, response, next) => {
  const person = request.body

  const newPerson = new Person({
    name: person.name,
    number: person.number
  })

  /* newPerson.save().then(savedPerson => {
    response.status(201).json(savedPerson)
  }).catch(error => next(error)) */

  try {
    const savedPerson = await newPerson.save()
    response.json(savedPerson)
  } catch (error) {
    next(error)
  }
})

personsRouter.put('/:id', async (request, response, next) => {
  const { id } = request.params
  const person = request.body

  const updatedPerson = {
    name: person.name,
    number: person.number
  }

  const updatePerson = await Person.findByIdAndUpdate(id, updatedPerson, { new: true })
  response.json(updatePerson).end()
})

module.exports = personsRouter
