const express = require('express')
const app = express()
const path = require('path')

const loginRouter = require('./controllers/login')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')

const mongoose = require('mongoose')
const config = require('./utils/config')
const cors = require('cors')
const middleware = require('./utils/middleware')

//Connnect to MongoDB
mongoose.connect(config.MONGO_URL)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch(error => console.log(error))

app.use(cors())
app.use(express.static('build'))
app.use(express.json()) //parses body of request

app.use(middleware.tokenExtractor)
app.use(middleware.userExtractor)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.get('*', (request, response) => response.sendFile(path.resolve('build', 'index.html')))

app.use(middleware.errorHandler)

module.exports = app
