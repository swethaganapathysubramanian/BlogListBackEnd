const Blog = require('../models/blog')

const BlogList = [
    {
        "title": "My First Blog",
        "author": "Swetha",
        "url": "www.livetoeat.netlify.com",
        "likes": 1
    },
    {
        "title": "My Second Blog",
        "author": "Swetha",
        "url": "www.livetoeat.netlify.com",
        "likes": 2
    },
    {
        "title": "My Third Blog",
        "author": "Swetha",
        "url": "www.livetoeat.netlify.com",
        "likes": 3
    }
]


const blogsInDb = async () =>{
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON)
}   


module.exports = { blogsInDb, BlogList }