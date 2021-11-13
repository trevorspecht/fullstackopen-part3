const express = require('express')
const morgan = require('morgan')
var cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan(
    ':method :url :status :res[content-length] - :response-time ms :body'
))

morgan.token('body', (req, res) => {
    return JSON.stringify(req.body)
})

let phonebook = [
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
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(phonebook)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const found = phonebook.find(person => person.id === id)
    
    if (found) 
        response.json(found)
    else 
        response.send(404).end()
})

const generateId = () => {
    return id = Math.floor(Math.random() * 1000000)
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log('request: ', request.body, 'status: ', response.status)
    if(!body.name || body.name.length === 0){
        return response.status(400).json({ error: 'name missing' })
    }
    else if(!body.number || body.number.length === 0){
        return response.status(400).json({ error: 'number missing' })
    }
    else if(phonebook.find(person => person.name === body.name)){
        return response.status(400).json({ error: 'name must be unique' })
    }

    const newPerson = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    phonebook = phonebook.concat(newPerson)
    response.json(phonebook)
})

app.get('/info', (request, response) => {
    const date = new Date(Date.now())
    response.send(
        `<p>Phonebook has info for ${phonebook.length} people</p>
        <p>${date}</p>`
    )
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
  
    phonebook = phonebook.filter(person => person.id !== id)
    response.status(204).end()
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: `unknown endpoint: ${request.originalUrl}` })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})