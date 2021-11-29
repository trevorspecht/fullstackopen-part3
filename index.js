require('dotenv').config()
const express = require('express')
var cors = require('cors')
const app = express()

const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())



app.get('/api/persons', (request, response) => {
    Person.find({}).then(phonebook => {
        response.json(phonebook)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
    .then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => {
        console.log(error)
        response.status(500).end()
    })
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log('request: ', request.body, 'status: ', response.status())
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

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

app.get('/info', (request, response) => {
    const date = new Date(Date.now())
    response.send(
        `<p>Phonebook has info for ${phonebook.length} people</p>
        <p>${date}</p>`
    )
})

app.put('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        Person.updateOne(person, { number: request.params.number })
            .then(person => response.json(person))
    })
})

app.delete('/api/persons/:id', (request, response) => {  
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
        if (result)
            response.status(204).end()
        else
            response.status(404).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: `unknown endpoint: ${request.originalUrl}` })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})