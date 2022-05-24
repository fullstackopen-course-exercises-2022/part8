const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 4
    },
    favoriteGenre: {
        type: String,
        required: true
    }
})

userSchema.set('toJSON', {
    transform: (doc, object) => {
        object.id = object._id.toString()
        delete object.__v
        delete object._id
    }
})

module.exports = mongoose.model('User', userSchema)