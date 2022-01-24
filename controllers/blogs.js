const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name:1})   
    res.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
    const body = request.body
    console.log(body)
    const user = request.user
    try {
        const blog = new Blog({
            title: body.title,
            author: body.author, 
            url: body.url,
            likes: body.likes,
            user: user._id
        })
        const result = await blog.save()
        const updatedRes = await Blog.findById(result.id).populate('user', {username: 1, name:1})
        user.blogs = user.blogs.concat(result._id)
        await user.save()
        response.status(201).json(updatedRes)
    } catch (err) {
        next(err)
    }
})

blogsRouter.put('/:id', async (request, response, next) => {
    const body = request.body
    const user = request.user
    if (!user) {
        return response.json({error: 'Not authorized to update blog'})
    }
    try {
        const blog = await Blog.findById(request.params.id)
        if (!blog) {
            return response.json({error: 'Blog does not exist'})
        } 
        blog.likes = body.likes
        const updatedBlog = await blog.save()
        response.status(201).json(updatedBlog)
    } catch (err) {
        next(err)
    }
})

blogsRouter.delete('/:id', async (request, response, next) => {
    const user = request.user
    try {
        const blog = await Blog.findById(request.params.id)
        if (!blog) {
            response.status(404).json({error: 'Blog does not exist'})
        } else if (!user || !blog.user || blog.user._id.toString() !== user.id.toString()) {
            response.status(401).json({error: 'Not authorized to delete blog'})
        } else {
            user.blogs = user.blogs.filter(uB => uB.toString() !== blog._id.toString())
            await user.save()
            await blog.remove()
            response.status(204).end()
        }
    } catch (err) {
        next(err)
    }
})

module.exports = blogsRouter