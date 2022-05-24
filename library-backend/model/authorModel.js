const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 4
    },
    born: {
        type: Number,
    },
})

schema.set('toJSON', {
    transform: (doc, object) => {
        object.id = object._id.toString()
        delete object.__v
        delete object._id
    }
})

module.exports = mongoose.model('Author', schema)