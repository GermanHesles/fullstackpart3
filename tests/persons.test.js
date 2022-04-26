const mongoose = require('mongoose')

const { server } = require('../index')
const Person = require('../models/Person')
const { api, initialPersons, getAllPersons, getPersonById } = require('./test_helper')

beforeEach(async () => {
  await Person.deleteMany({})

  /*   const personsObjects = initialPersons.map(person => new Person(person))
  const promises = personsObjects.map(person => person.save()) */

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
  const { names } = await getAllPersons()

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
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const { names, response } = await getAllPersons()

  expect(response.body).toHaveLength(initialPersons.length + 1)
  expect(names).toContain(newPerson.name)
})

test('a person without name or number can not be added', async () => {
  const newPerson = {
    name: '',
    number: ''
  }

  await api
    .post('/api/persons')
    .send(newPerson)
    .expect(422)

  const { response } = await getAllPersons()

  expect(response.body).toHaveLength(initialPersons.length)
})

test('a person can be deleted', async () => {
  const { response: firstResponse } = await getAllPersons()
  const { body: persons } = firstResponse
  const personToDelete = persons[0]

  await api
    .delete(`/api/persons/${personToDelete.id}`)
    .expect(200)

  const { names, response: secondResponse } = await getAllPersons()

  expect(secondResponse.body).toHaveLength(initialPersons.length - 1)
  expect(names).not.toContain(personToDelete.name)
})

test('a person can be update', async () => {
  const { response: allPersonsResponse } = await getAllPersons()

  const { body: persons } = allPersonsResponse
  const personToUpdate = persons[0]
  const newDataPerson = {
    name: 'James Bowlss',
    number: '876455-433'
  }
  await api
    .put(`/api/persons/${personToUpdate.id}`)
    .send(newDataPerson)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const updatedPerson = await getPersonById(personToUpdate.id)

  // expect(response).toHaveLength(initialPersons.length)
  // expect(names).toContain('James Bowlss')
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
