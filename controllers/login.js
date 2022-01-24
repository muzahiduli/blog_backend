const loginRouter = require('express').Router()
const User = require('../models/user')
const jsonwebtoken = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const config = require('../utils/config')

loginRouter.post('/', async (request, response) => {
    const body = request.body
    const user = await User.findOne({username: body.username})
    const passwordValid = user === null 
        ? false
        : await bcrypt.compare(body.password.toString(), user.passWordHash)
    
    if (!(user && passwordValid)) {
        return response.status(401).json({error: 'invalid username or password'})
    }

    const userForToken = {
        username: user.username,
        id: user._id
    }

    const token = jsonwebtoken.sign(userForToken, config.SECRET)
    response.status(200)
        .json({token, username: user.username, name: user.name})
})

module.exports = loginRouter