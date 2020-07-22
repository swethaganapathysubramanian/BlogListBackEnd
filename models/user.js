const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
//4.15,4.16
const userSchema = mongoose.Schema({
    name: {
        type: String,
    },
    username : {
        type : String,
        unique: true,
        minlength:3,
        required:true
    },
    passwordHash :{
        type: String,
        required: true
    },
    about: {
        type: String
    },
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ]
}) 

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        // the passwordHash should not be revealed
        delete returnedObject.passwordHash
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User