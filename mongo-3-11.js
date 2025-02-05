const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.pzyzkcs.mongodb.net/personApp?retryWrites=true&w=majority`

  mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  console.log("phonebook:")
  Person
  .find({})
  .then(result => {
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
    process.exit(1)
  })
}

if (process.argv.length > 3) {
  const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
  })

  person.save().then(result => {
  console.log('person saved!')
  mongoose.connection.close()
  process.exit(1)
  })
}

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})