var lodash = require('lodash');
//4.3
const dummy = (blogs) => {
    return 1
}
//4.4
const totalLikes = (blogs) => {

    const total = blogs.reduce((sum,blog)=>{
        return sum + blog.likes
    },0)

    return blogs.length === 0 ?
    0 :
    total
}
//4.5
const mostLiked = (blogs) => {
    const maxLiked = blogs.reduce((most, blog) => most.likes > blog.likes ? most : blog)
    
    const maxBlog = {
        title: maxLiked.title,
        author: maxLiked.author,
        likes: maxLiked.likes
    }

    return maxBlog
}
//4.6
const MaxAuthor = (blogs) => {
    const groupedBlogs = lodash.groupBy(blogs, 'author')
    let count = []
    for (let [key, value] of Object.entries(groupedBlogs)){
        const author = {
            author: key,
            blogs: value.length
        }
        count.push(author)
    }

    return maxBlog = count.reduce((most,author) => most.blogs > author.blogs ? most : author)

}
//4.7
const MaxAuthorLikes = (blogs) => {
    const groupedBlogs = lodash.groupBy(blogs, 'author')
    let count = []
    for (let [key, value] of Object.entries(groupedBlogs)) {
        const likes = value.reduce((total,blog) => 
        {   
            return total+blog.likes
        },0)

        const author = {
            author: key,
            likes: likes
        }
        count.push(author)
    }
    console.log(count)
    return maxBlog = count.reduce((most, author) => most.likes > author.likes ? most : author)

}

module.exports = {
    dummy,
    totalLikes,
    mostLiked,
    MaxAuthor,
    MaxAuthorLikes
}