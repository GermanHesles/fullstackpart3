const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/User')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('persons', {
    name: 1,
    number: 1
  })
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { body } = request
  const { username, name, password } = body

  if (!username || !password) {
    return response.status(400).json({
      error: 'requeride "content" fied is missing'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const newUser = new User({
    username,
    name,
    passwordHash
  })

  try {
    const savedUser = await newUser.save()

    response.status(201).json(savedUser)
  } catch (error) {
    response.status(400).json(error)
  }
})

usersRouter.delete('/:id', async (request, response) => {
  const { id } = request.params

  await User.findByIdAndDelete(id)
  response.status(200).end()
})

module.exports = usersRouter
