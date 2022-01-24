const User = require('../models/user')
const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')


usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', {url: 1, title: 1, author: 1, id: 1})
    response.json(users)
})

usersRouter.post('/', async (request, response, next) => {
    const body = request.body
    if (body.password.length < 3) {
        return next({
            name: 'ValidationError', 
            message: 'Password must be at least three characters long'
        })
    }

    const passWordHash = await bcrypt.hash(body.password, 10)
    const user = new User({
        username: body.username,
        name: body.name,
        passWordHash,
        blogs: []
    })
    
    try {
        const res = await user.save()
        response.json(res)
    } catch(err) {
        next(err)
    }
})

module.exports = usersRouter