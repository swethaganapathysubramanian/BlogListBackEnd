

const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
var fs = require('fs');
var path = require('path'); 
var multer = require('multer');
const app = require('../app');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname + '-' + Date.now())
    }
});

var upload = multer({ storage: storage }).any(); 


blogRouter.get('/',async (request, response, next) => {
    //4.17
    const blogs = await Blog.find({}).populate('user',{username:1})
    try{
    response.json(blogs)
    }catch(error) {
     next(error)
    }
})

blogRouter.post('/', upload, async (request, response, next) => {
    console.log(process.cwd())
    console.log(request.body)
    console.log(request.files)
    const token = request.token || null
    const decodedToken = jwt.verify(token,process.env.SECRET)
    
    if (!token || !decodedToken.id){
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    //4.19
    const user = await User.findById(decodedToken.id)
    const newBlog = new Blog ({
        title:request.body.title,
        author:request.body.author,
        url:request.body.url,
        desc: request.body.desc,
        blogType: request.body.blogType,
        image: {
            data: fs.readFileSync(path.join(process.cwd()+'/uploads/' + request.files[0].filename)),
            contentType: 'image/png'
        } , 
        insta: request.body.insta,
        facebook: request.body.facebook,
        twitter: request.body.twitter,
        dribble: request.body.dribble,
        likes:request.body.likes || 0,
        user:user._id
    })
    
    try{
    const savedBlog = await newBlog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(200).json(savedBlog.toJSON())

    } catch(error){
        next(error)
    }
})

blogRouter.delete('/:id', async (request, response, next) => {
    const token = request.token
    console.log(token)

    const blog = await Blog.findById(request.params.id)
    console.log(blog)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    console.log(decodedToken)
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    //4.21
    if (!(decodedToken.id === blog.user.toString())){
      return response.status(400).send("User does not have permission to delete this Blog")
    } else {
    const deletedNode = await Blog.findByIdAndDelete(request.params.id)
    console.log(deletedNode)
    response.status(204).end()
}})

blogRouter.put('/:id', async (request, response, next) => {
    const updateBlog = {
        title: request.body.title,
        author: request.body.author,
        url: request.body.url,
        likes: request.body.likes
    }
    try{
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, updateBlog, { new: true })
    response.json(updatedBlog.toJSON())
    } catch (error) {
        next(error)
    }
})

blogRouter.post('/:id/comments', async (request, response, next) => {
    const comment = request.body.comment
    console.log(request.body)
    if(comment) 
    try {
        const BlogData = await Blog.findById(request.params.id)
        BlogData.comments.push(comment)
        await BlogData.save()
        console.log(BlogData)
        response.status(200).json(BlogData.toJSON())
       
    } catch (error) {
        next(error)
    }
}
)


module.exports = blogRouter