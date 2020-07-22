const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const helper = require('../utils/blogtesthelper')
const User = require('../models/user')

describe('user insertion tests',() =>{
beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
    console.log('done')
})

// test('List one user from DB', async () =>{

// })

test('unable to create user with Invalid username', async () =>{

    const user = ({ username: 'i', password: 'secret' })

    const message = await api
                        .post('/api/users')
                        .send(user)
                        .expect(400)
    expect(message.body.error).toContain('validation failed')
})

test('unable to create user with Invalid password', async () =>{

    const user = ({ username: 'Happy', password: 's' })

    const message = await api
                        .post('/api/users')
                        .send(user)
                        .expect(400)

    console.log(message.body)
    expect(message.body).toContain('Pasword length too low')
})
})


afterAll(() => {
    mongoose.connection.close()
}) 