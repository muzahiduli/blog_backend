const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (likes, blog) => {
        return likes + blog.likes
    }
    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const reducer = (likes, blog) => {
        return Math.max(likes, blog.likes)
    }
    const maxLikes = blogs.reduce(reducer, 0)
    return blogs.find(blog => maxLikes === blog.likes)
}

const mostBlogs = (blogs) => {
    const allBlogs = new Object()
    blogs.forEach(blog => {
        if (!(blog.author in allBlogs)) {
            allBlogs[blog.author] = 1
        } else {
            allBlogs[blog.author] = allBlogs[blog.author] + 1
        }
    })
    let maxBlogs = 0
    let maxAuthor = ''
    for (const author in allBlogs) {
        maxBlogs = Math.max(allBlogs[author], maxBlogs)
    }
    for (const author in allBlogs) {
        if (maxBlogs === allBlogs[author]) {
            maxAuthor = author
        }
    }
    return {author: maxAuthor, blogs: maxBlogs}
}


module.exports = { 
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
}