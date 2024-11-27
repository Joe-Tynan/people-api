const mongoose = require('mongoose');
require('dotenv').config()

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI;
mongoose.connect(url).then(result => {
    console.log('Connected to MongoDB!');
}).catch(error => {
    console.log('Error connecting to MongoDB', error.message);
})

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        required: true,
        validate: {
            validator: function(value) {
                return /\d{5}-\d{6}/.test(value);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)