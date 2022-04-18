const mongoose = require('mongoose')
const supertest = require('supertest')

const { app, server } = require('../index')
const Person = require('../models/Person')
const { initialPersons } = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Person.deleteMany({})

  const person1 = new Person(initialPersons[0])
  await person1.save()

  const person2 = new Person(initialPersons[1])
  await person2.save()
})

test('persons are returned as json', async () => {
  await api
    .get('/api/persons')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two persons', async () => {
  const response = await api.get('/api/persons')
  expect(response.body).toHaveLength(initialPersons.length)
})

test('the first person name is James Bowlss', async () => {
  const response = await api.get('/api/persons')

  const names = response.body.map(person => person.name)

  expect(names).toContain('James Bowlss')
})

test('a valid person can be added', async () => {
  const newPerson = {
    name: 'async/await',
    number: '606-5435443'
  }

  await api
    .post('/api/persons')
    .send(newPerson)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/persons')

  const names = response.body.map(person => person.name)

  expect(response.body).toHaveLength(initialPersons.length + 1)
  expect(names).toContain(newPerson.name)
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
