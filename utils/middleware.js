const User = require('../models/user')
const jwt = require('jsonwebtoken')


//Sets token in request.token field
const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        request.token =  authorization.substring(7)
    } else {
        request.token = null
    }
    next()
}

//Decrypts token to get the userId
const userExtractor = async (request, response, next) => {
    const token = request.token
    try {
        const decodedToken = jwt.verify(token, process.env.SECRET) //returns payload used to sign token
        if (!decodedToken.id) {
            return response.status(401).json({error: 'token missing/invalid'})
        } else {
            request.user = await User.findById(decodedToken.id)
        }
    }catch (err) {
        request.user = null
    }
    next()
}



const errorHandler = (error, request, response, next) => {
    console.log(error.message) 
    if (error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(400).json({error: error})
    }
    next()
}
module.exports = {
    errorHandler,
    userExtractor,
    tokenExtractor
}