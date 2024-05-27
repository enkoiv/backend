const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

let persons = []

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.post('/api/persons', (request, response) => {
  const r = request.body

  const min = 0
  const max = 10000

  if (!r.name) {
    return response.status(400).json({
        error: 'name is missing' })
  }

  if (!r.number) {
      return response.status(400).json({
          error: 'number is missing' })
  }

  if (persons.filter(p => p.name === r.name).length !== 0) {
      return response.status(409).json({
      error: 'name must be unique' })
  }

  const person = new Person({
    name: r.name,
    number: r.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})