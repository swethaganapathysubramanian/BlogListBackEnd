const mongoose = require('mongoose')


const blogSchema = mongoose.Schema({
    title: {
        type:String,
        required:true
    },
    author: String,
    url: {
        type: String,
        required: true
    },
    desc: {
        type: String
    },
    blogType: {
        type: Array,
        default: []
    },
    image: { 
        data: Buffer, contentType: String 
    },
    insta: {
        type: String
    },
    facebook: {
        type: String
    },
    twitter: {
        type: String
    },
    dribble: {
        type: String
    },
    likes: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: {
        type: Array,
        default: []
    }
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Blog', blogSchema)
