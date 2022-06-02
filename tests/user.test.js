const mongoose = require('mongoose')

const { server } = require('../index')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const { api, getUsers } = require('./test_helper')

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('pswd', 10)
    const user = new User({
      username: 'root',
      passwordHash,
      _id: new mongoose.Types.ObjectId('56cb91bdc3464f14678934ca')
    })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const newUser = {
      username: 'midudev',
      name: 'Miguel',
      password: 'twitch'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await getUsers()

    expect(usersAtEnd).toHaveLength(2)

    const usernames = usersAtEnd.map(user => user.username)
    expect(usernames).toContain('midudev')
  })

  test('creation falls with proper statuscode and message if username is already taken', async () => {
    const usersAtStart = await getUsers()

    const newUser = {
      username: 'root',
      name: 'Miguel',
      password: 'echoplex'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(422)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await getUsers()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  afterAll(() => {
    mongoose.connection.close()
    server.close()
  })
})
