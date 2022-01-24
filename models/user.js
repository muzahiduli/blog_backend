const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3
    },
    name: {
        type: String,
        required: true
    },
    passWordHash: {
        type: String,
        required: true
    },
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ]
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passWordHash
    }
})

const userModel = new mongoose.model('User', userSchema)

module.exports = userModel