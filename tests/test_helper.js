const { app } = require('../index')
const supertest = require('supertest')

const api = supertest(app)

const initialPersons = [
  {
    name: 'James Bowlss',
    number: '432-5433334'
  },
  {
    name: 'John Dee',
    number: '123-123123'
  }
]

const getAllPersons = async () => {
  const response = await api.get('/api/persons')
  return {
    names: response.body.map(person => person.name),
    response
  }
}

const getPersonById = async (id) => {
  const response = await api.get(`api/persons/${id}`)
  return response.body
}

module.exports = {
  getAllPersons,
  api,
  initialPersons,
  getPersonById
}
