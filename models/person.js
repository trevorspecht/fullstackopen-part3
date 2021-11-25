const mongoose = require('mongoose')

const URI = process.env.MONGODB_URI

console.log('connecting to MongoDB')

mongoose.connect(URI)
.then(result => {
    console.log('successfully connected to MongoDB')
})
.catch((error) => {
    console.log('error connecting to MongoDB', error.message)
})

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)