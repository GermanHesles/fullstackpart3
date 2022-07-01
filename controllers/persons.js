const personsRouter = require('express').Router()
const Person = require('../models/Person')
const User = require('../models/User')
const userExtractor = require('../middleware/userExtractor')

personsRouter.get('/info', async (request, response) => {
  const date = new Date()
  const persons = await Person.find({})
  response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${date}</p>`)
})

personsRouter.get('/', async (request, response) => {
  const persons = await Person.find({}).populate('user', {
    username: 1,
    name: 1
  })
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

personsRouter.delete('/:id', userExtractor, async (request, response, next) => {
  const { id } = request.params

  try {
    await Person.findByIdAndDelete(id)
    response.status(200).end()
  } catch (error) {
    next(error)
  }
})

personsRouter.post('/', userExtractor, async (request, response, next) => {
  const { name, number } = request.body

  const { userId } = request

  const user = await User.findById(userId)

  const newPerson = new Person({
    name,
    number,
    user: user._id
  })

  try {
    const savedPerson = await newPerson.save()

    user.persons = user.persons.concat(savedPerson._id)
    await user.save()

    response.json(savedPerson)
  } catch (error) {
    next(error)
  }
})

personsRouter.put('/:id', userExtractor, async (request, response) => {
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
