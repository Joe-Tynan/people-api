const mongoose = require('mongoose')

if(process.argv.length < 3) {
    console.log('Please provide password as an argument')
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://tynanjoe79:${password}@cluster0.37ch0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)


if( process.argv.length === 5 ) {

    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })

    person.save().then(() => {
        console.log(`Added ${person.name} number ${person.number} to the Phonebook`)
        mongoose.connection.close()
    })

} else {

    Person.find({}).then(result => {
        result.forEach((person) => {
            console.log(person)
        })
        mongoose.connection.close()
    })

}