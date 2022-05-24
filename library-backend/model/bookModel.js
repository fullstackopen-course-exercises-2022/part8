const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        minlength: 2
    },
    published: {
        type: Number,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    },
    genres: [
        { type: String }
    ]
})

schema.set('toJSON', {
    transform: (doc, object) => {
        object.id = object._id.toString()
        delete object.__v
        delete object._id
    }
})

module.exports = mongoose.model('Book', schema)