const uuid = require('uuid/v4')
const fsPromises = require('fs').promises
const path = require('path')

const artistComment = {
    add(comment) {
        if(typeof comment !== 'object') throw Error(comment + ' is not an object')

        comment.id = uuid()
        
        const file =  path.join(__dirname, 'artist-comments.json')

        return fsPromises.readFile(file, 'utf8')
            .then(content => JSON.parse(content))
            .then(content => {
                content.push(comment)
                return content
            })
            .then(content => fsPromises.writeFile(file, JSON.stringify(content)))
    },

    retrieve(commentId) {
        const file = path.join(__dirname, 'artist-comments.json')

        return fsPromises.readFile(file, 'utf8')
            .then(content => JSON.parse(content))
            .then(content => {
                const comments = content.find(element => element.id === commentId)
                return comments ? comments : null
            })
    },

    update(comment) {
        const file = path.join(__dirname, 'artist-comments.json')

        return fsPromises.readFile(file, 'utf8')
            .then(content => JSON.parse(content))
            .then(content => {
                const updatedComment = content.find(element => element.id === comment.id)
                updatedComment.text = comment.text
                return content
            })
            .then(content => fsPromises.writeFile(file, JSON.stringify(content)))
    },

    delete(commentId) {
        const file = path.join(__dirname, 'artist-comments.json')
        
        return fsPromises.readFile(file, 'utf8')
            .then(content => JSON.parse(content))
            .then(content => {
                const index = content.findIndex(element => element.id === commentId)
                content.splice(index, 1)
                return content
            })
            .then(content =>fsPromises.writeFile(file, JSON.stringify(content)))
    },

    find(id) {
        const file = path.join(__dirname, 'artist-comments.json')

        return fsPromises.readFile(file, 'utf8')
            .then(content => JSON.parse(content))
            .then(content => {
                Object.keys(id).forEach(key => comments = content.filter(comment => comment[key] === id[key]))
                return comments
            })
    }
}

module.exports = artistComment