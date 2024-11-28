const express = require('express')
const app = express()

const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

morgan.token('body', request => {
    return JSON.stringify(request.body)
})

app.use(morgan(':method :url - :response-time ms :body'))

const Person = require('./models/person')

let date = new Date()

app.get('/api/info', (request, response) => {
    Person.find({}).then(people => {
        response.send('<p>Phonebook has info for ' + people.length + ' people</p><p>Request Receieved: ' + date + '</p>')
    })
})

app.get('/api/people', (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
    })
})

app.get('/api/people/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if( person ) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    }).catch((error) => {
        next(error)
    })
})

app.post('/api/people', (request, response, next) => {

    if( request.body.name === undefined || request.body.number === undefined ) {
        return response.status(400).json({ error: 'Content Missing' })
    }

    const person = new Person({
        name: request.body.name,
        number: request.body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    }).catch(error => {
        next(error)
    })
})

app.put('/api/people/:id', (request, response, next) => {

    const person = {
        name: request.body.name,
        number: request.body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, {
        new: true,
        runValidators: true,
        context: 'query',
    }).then(updatedPerson => {
        response.json(updatedPerson)
    }).catch((error) => {
        next(error)
    })
})

app.delete('/api/people/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id).then(() => {
        response.status(204).end()
    }).catch(error => {
        next(error)
    })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'Unknown Endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if( error.name === 'CastError' ) {
        return response.status(400).send({ error: 'Malformatted ID' })
    } else if ( error.name === 'ValidationError' ) {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})