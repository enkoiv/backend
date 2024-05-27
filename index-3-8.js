const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(morgan('tiny'))
app.use(express.json())
app.use(express.static('build'))
app.use(cors())

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendick",
        "number": "39-23-6423122" 
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(
        p => p.id === id)
    if (person) {
        response.json(person)
    }
    else {
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    date = new Date()
    response.send(
        `<p>
        Phonebook has info for ${persons.length} people
        </p>
        <p>
        ${date}
        </p>`
        )
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const min = 0
    const max = 10000
    const r = request.body

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

    const person = {id: 0}
    person.id = Math.floor(Math.random()*(max-min+1)+min)
    person.name = r.name
    person.number = r.number
    
    persons = persons.concat(person)
    response.status(201)
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})