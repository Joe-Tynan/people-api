const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const {request} = require("express");

app.use(express.json());
app.use(cors());

morgan.token('body', request => {
    return JSON.stringify(request.body);
})

app.use(morgan(':method :url - :response-time ms :body'));

let date = new Date();
let people = [
    {
        "id": "1",
        "name": "Joe",
        "number": "999"
    },
    {
        "id": "2",
        "name": "Chris",
        "number": "222"
    },
    {
        "id": "3",
        "name": "Dave",
        "number": "333"
    },
    {
        "id": "4",
        "name": "Jason",
        "number": "555"
    },
    {
        "id": "5",
        "name": "Roger",
        "number": "777777"
    }
]

app.get('/api/info', (request, response) => {
    console.log(request.query)
    response.send('<p>Phonebook has info for ' + people.length + ' people</p><p>Request Receieved: ' + date + '</p>')
})

app.get('/api/people', (request, response) => {
    response.json(people)
})

app.get('/api/people/:id', (request, response) => {
    const id = request.params.id
    const person = people.find(person => person.id === id)

    if(person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.post('/api/people', (request, response) => {
    const person = request.body
    const maxId = people.length > 0 ? Math.max(...people.map(person => Number(person.id))) : 0

    person.id = String(maxId + 1)

    if(!person.name || !person.number) {
        return response.status(400).json(
            { error: 'Content missing' }
        )
    }

    if(people.some(obj => obj.name === person.name) ) {
        return response.status(400).json(
            { error: 'Name must be unique' }
        )
    }

    people = people.concat(person)
    response.json(person)
})

app.delete('/api/people/:id', (request, response) => {
    const id = request.params.id
    people = people.filter(person => person.id !== id)

    response.status(204).end()
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})