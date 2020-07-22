const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
//4.15 login
loginRouter.post('/', async (request, response) => {
    console.log(request.body.username)
    body = request.body
    const user = await User.findOne({username:body.username})
    console.log(user)
    if(!user){
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }
    const correctPassword = body.password === null?
                            false:
                            await bcrypt.compare(body.password,user.passwordHash)
    //console.log(correctPassword)
    if(!(user && correctPassword)){
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }
    //4.18
    const userForToken = {
        name:user.username,
        id:user._id
    }

    const token = jwt.sign(userForToken,process.env.SECRET)
    
    response.status(200).send({token:token, username: user.username, name: user.name, id:user._id})
})

module.exports = loginRouter