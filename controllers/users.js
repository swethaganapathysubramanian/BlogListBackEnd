const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
//4.15
userRouter.get('/', async (request, response) =>{
    //4.17
    const users = await User.find({}).populate('blogs',{title:1})
    response.json(users)
})

userRouter.get('/:id', async (request, response) => {
    const id = request.params.id
    console.log(id)
    //4.17
    const users = await User.findById(id).populate('blogs', { title: 1 })
    response.json(users)
})

userRouter.post('/', async (request, response) => {
    body = request.body
    console.log(body)
    const saltRounds = 10
    if(body.password.length < 3){
        response.status(400).json("Pasword length too low")
    }
    const hashedPassword = await bcrypt.hash(body.password,saltRounds)

    const newUser = new User ({
        name:body.name,
        username: body.username,
        passwordHash: hashedPassword,
        about: body.about
    })

    const savedUser = await newUser.save()
    
    response.status(200).json(savedUser)
})

module.exports = userRouter