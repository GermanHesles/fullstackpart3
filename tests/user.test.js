const mongoose = require('mongoose')

const { server } = require('../index')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const { api, getUsers } = require('./test_helper')

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('pswd', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await getUsers()

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

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(user => user.username)
    expect(usernames).toContain('midudev')
  })

  afterAll(() => {
    mongoose.connection.close()
    server.close()
  })
})
