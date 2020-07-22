const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const helper = require('../utils/blogtesthelper')
const User = require('../models/user')
//4.22 tests after Login
describe('Login and use token', () =>{

    beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
})

test('Login check', async() =>{
    const user = {
        username:'root',
        password:'secret'
    }
    const login = await api
                        .post('/api/login')
                        .send(user)
                        .expect(200)
    expect(login.body.token).toBeDefined()
})

test('Invalid Login check', async() =>{
    const user = {
        username:'root',
        password:'hello'
    }
    const login = await api
                        .post('/api/login')
                        .send(user)
                        .expect(401)

    expect(login.body.error).toContain('invalid username or password')
})

test('Login and POST', async() =>{
    const user = {
        username:'root',
        password:'secret'
    }
    const login = await api
                        .post('/api/login')
                        .send(user)
                        .expect(200)

    expect(login.body.token).toBeDefined()
    const token = login.body.token
    console.log(token)
    const userFromDB = User.findOne({ username:user.username })

    const newBlog = {
    title:"My Testing Blog",
    author:"Hello",
    url:"www.livetoeat.netlify.com",
    likes:2,
    user:userFromDB._id
}
    console.log('newBlog')
    const Blog = await api
                    .post('/api/blogs')
                    .set('Authorization',`bearer ${token}`)
                    .send(newBlog)
                    .expect(200)

})

test('Unatuhorized Login and POST', async() =>{
    const user = {
        username:'root',
        password:'secret'
    }
    const login = await api
                        .post('/api/login')
                        .send(user)
                        .expect(200)

    expect(login.body.token).toBeDefined()
    const token = login.body.token
    //console.log(token)
    const userFromDB = User.findOne({ username:user.username })

    const newBlog = {
    title:"My Testing Blog",
    author:"Hello",
    url:"www.livetoeat.netlify.com",
    likes:2,
    user:userFromDB._id
}
    //console.log('newBlog')
    const Blog = await api
                    .post('/api/blogs')
                    .send(newBlog)
                    .expect(401)

})
})

afterAll(() => {
    mongoose.connection.close()
}) 

