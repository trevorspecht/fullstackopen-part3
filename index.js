require('dotenv').config()
const express = require('express')
var cors = require('cors')
const app = express()

const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())


// routes

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(phonebook => {
      response.json(phonebook)
    })
    .catch(next)
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        return response.status(404).send({ error: 'id not found' })
      }
    })
    .catch(next)
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  if(!body.name || body.name.length === 0){
    return response.status(400).json({ error: 'name missing' })
  }
  else if(!body.number || body.number.length === 0){
    return response.status(400).json({ error: 'number missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(next)
})

app.get('/info', (request, response, next) => {
  const date = new Date(Date.now())
  Person.find({})
    .then(phonebook => {
      response.send(
        `<p>Phonebook has info for ${phonebook.length} people</p>
            <p>${date}</p>`
      )
    })
    .catch(next)
})

app.put('/api/persons/:id', (request, response, next) => {
  const update = { number: request.body.number }
  const options = {
    new: true,
    runValidators: true
  }
  Person.findByIdAndUpdate(request.params.id, update, options)
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(next)
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      if (result)
        return response.status(204).end()
      else
        return response.status(404).send({ error: 'id not found' })
    })
    .catch(next)
})


// middlewares

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: `unknown endpoint: ${request.originalUrl}` })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ errname: error.name, errmsg: error.message })
  }

  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})