module.exports = (error, request, response, next) => {
  console.error(error)

  if (error.name === 'CastError') {
    response.status(400).send({ error: 'id is malformed' })
    return
  }

  if (error.name === 'ValidationError') {
    return response.status(422).json({ error: error.message })
  }

  response.status(500).end()
}
