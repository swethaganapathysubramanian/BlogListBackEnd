//upto 4.14 Updated blog post test are available in login.test.js

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('../utils/blogtesthelper')
const Blog = require('../models/blog')

beforeEach(async() =>{
    await Blog.deleteMany({})

    for(let blog of helper.BlogList){
        let blogObject = new Blog(blog)
        await blogObject.save()
    }
    console.log('done')
})
//4.8 step one
test ('Number of Blogs in DB', async() =>{
    
    const blogs = await api.get('/api/blogs')
                
    expect(blogs.body).toHaveLength(helper.BlogList.length)
})

//4.9 step two 
test ('unique identifier', async() => {

    const blogs = await api
                        .get('/api/blogs')
                        .expect(200)
                        .expect('Content-Type', /application\/json/)

    const blogId = blogs.body[0].id

    expect(blogId).toBeDefined();
})

//4.10 Post new data
//updated login and post test available in login test
test ('post new data', async() =>{

    const newBlog = {
        "title": "My Fourth Blog",
        "author": "Swetha",
        "url": "www.livetoeat.netlify.com",
        "likes": 4
    }

    await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const titleAfterPost = response.body.map(b => b.title)
    expect(titleAfterPost).toContain('My Fourth Blog')

    const BlogsAtEnd = await helper.blogsInDb()
    expect(BlogsAtEnd).toHaveLength(helper.BlogList.length + 1)
})

//4.11 Likes missing from request 

test ('test new likes', async() =>{
    const newBlog = {
        "title": "My Fourth Blog",
        "author": "Swetha",
        "url": "www.livetoeat.netlify.com",
    }

    const result = await api
                    .post('/api/blogs')
                    .send(newBlog)
                    .expect(200)
                    .expect('Content-Type', /application\/json/)
                
    expect(result.body.likes).toBeDefined()
    expect(result.body.likes).toBe(0)

})

//4.12 title,url error
test('test new title and url', async () => {
    const newBlog = {
        "author": "Swetha",
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
})
//4.13 test
test('test delete one', async () => {
    const blogs = await api.get('/api/blogs')
    console.log(blogs.body[0])
    const blogToDelete = blogs.body[0].id
    console.log(blogToDelete)
    await api
        .delete(`/api/blogs/${blogToDelete}`)
        .expect(204)

})
//4.14 test
test('update likes', async () => {
    
    const blogs = await api.get('/api/blogs')
    console.log(blogs.body[0])
    const BlogToUpdate = blogs.body[0].id
    const newBlog = {
        "title": "My First Blog",
        "author": "Swetha",
        "url": "www.livetoeat.netlify.com",
        "likes": 10
    }

    await api
        .put(`/api/blogs/${BlogToUpdate}`)
        .send(newBlog)
        .expect(200)
})

afterAll(() => {
    mongoose.connection.close()
}) 