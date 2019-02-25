'use strict'

const { ObjectId } = require('mongodb')
const users = {
    collection: null,

    add(user) {
        if (user.constructor !== Object) throw TypeError(user + ' is not an object')

        if (typeof user.name !== 'string') throw TypeError(user.name + ' is not an string')

        if (!user.name.trim().length) throw Error ('user.name is empty')

        if (typeof user.surname !== 'string') throw TypeError(user.surname + ' is not an string')

        if (!user.surname.trim().length) throw Error ('user.surname is empty')

        if (typeof user.email !== 'string') throw TypeError(user.email + ' is not an string')

        if (!user.email.trim().length) throw Error ('user.email is empty')

        if (typeof user.password !== 'string') throw TypeError(user.password + ' is not an string')

        if (!user.password.trim().length) throw Error ('user.password is empty')

        return this.collection.insertOne(user)
            .then(res => res.insertedId.toString())
    },

    retrieve(id) {
        if (typeof id !== 'string') throw TypeError(id + ' is not an string')

        if (!id.trim().length) throw Error ('id is empty')

        return this.collection.findOne({_id: ObjectId(id)})
    },

    findByEmail(email) {
        if (typeof email !== 'string') throw TypeError(email + ' is not an string')

        if (!email.trim().length) throw Error ('email is empty')

        return this.collection.findOne({email})
            // .then(user => {
            //     return user
            // })
            //.catch(err => err.message('user not found'))
    },

    update(id, updates) {
        if (typeof id !== 'string') throw TypeError(id + ' is not an string')

        if (!id.trim().length) throw Error ('id is empty')

        if (updates.constructor !== Object) throw TypeError(updates + ' is not an object')

        const userId = ObjectId(id)

        return this.collection.findOneAndUpdate({_id: userId}, {$set: updates})
    },

    remove(id) {
        if (typeof id !== 'string') throw TypeError(id + ' is not an string')

        if (!id.trim().length) throw Error ('id is empty')

        return this.collection.deleteOne({_id: ObjectId(id)})
    }
}

module.exports = users