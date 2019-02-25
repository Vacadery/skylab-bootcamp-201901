'use strict'

require('dotenv').config()
const jwt = require('jsonwebtoken')
const { MongoClient, ObjectId } = require('mongodb')
const users = require('.')
const { expect } = require('chai')
const { env: { DB_URL, SECRET } } = process

describe('user', () => {
    let client

    before(() =>
        MongoClient.connect(DB_URL, { useNewUrlParser: true })
            .then(_client => {
                client = _client
                users.collection = client.db().collection('users')
            })
    )

    beforeEach(() => users.collection.deleteMany())

    describe('add', () => {
        const _user = {
            name: 'Tachi',
            surname: 'Melodin',
            email: 'tachito',
            password: 'meguhtalagasssolina'
        }

        it('should succeed on correct data', () =>
            users.add(_user)
                .then(id => {
                    expect(id).to.exist
                    expect(id).to.be.a('string')

                    return users.collection.findOne({ _id: ObjectId(id) })
                })
                .then(({ name, surname, email, password }) => {
                    expect(name).to.equal(_user.name)
                    expect(surname).to.equal(_user.surname)
                    expect(email).to.equal(_user.email)
                    expect(password).to.equal(_user.password)
                })
        )

        it('should fail on string for name')
            expect(() => users.add({name: '', surname: 'Melodin', email: 'tachito', password: 'meguhtalagasssolina'})).to.throw('user.name is empty')
                
    })

    describe('retrieve', () => {
        const _user = {
            name: 'Tachi',
            surname: 'Melodin',
            email: 'tachito',
            password: 'meguhtalagasssolina'
        }

        let _id

        beforeEach(() => {
            return users.collection.insertOne(_user)
                .then((res) => {
                    _id = res.insertedId.toString()
                })

        })

        it('should succeed on correct data', () => 
            users.retrieve(_id)
                .then(user => {
                    expect(user).to.exist
                    expect(user).to.be.an.instanceOf(Object)
                    expect(user.name).to.equal(_user.name)
                    expect(user.surname).to.equal(_user.surname)
                    expect(user.email).to.equal(_user.email)
                    expect(user.password).to.equal(_user.password)
                })
        )
    })

    describe('find by email', () => {
        const _user = {
            name: 'Tachi',
            surname: 'Melodin',
            email: 'tachito',
            password: 'meguhtalagasssolina'
        }

        beforeEach(() => users.collection.insertOne(_user))

        it('should succeed on correct data', () =>
            users.findByEmail(_user.email)
                .then(user => {
                    expect(user).to.exist
                    expect(user).to.be.an.instanceOf(Object)
                    expect(user.name).to.equal(_user.name)
                    expect(user.surname).to.equal(_user.surname)
                    expect(user.email).to.equal(_user.email)
                    expect(user.password).to.equal(_user.password)
                })
        )
    })

    describe('update', () => {
        const _user = {
            name: 'Tachi',
            surname: 'Melodin',
            email: 'tachito',
            password: 'meguhtalagasssolina'
        }

        const updates = {
            name: 'john',
            surname: 'doe'
        }

        let _id

        beforeEach(() => {
            return users.collection.insertOne(_user)
                .then((res) => {
                    _id = res.insertedId.toString()
                })

        })

        it('should succeed on correct data', () => {
            return users.update(_id, updates)
                .then(() => users.collection.findOne({ _id: ObjectId(_id) }))
                .then(res => {
                    expect(res).to.exist
                    expect(res.name).to.equal(updates.name)
                    expect(res.surname).to.equal(updates.surname)
                })
            })
    })

    describe('remove', () => {
        const _user = {
            name: 'Emma',
            surname: 'Cowdery',
            email: 'ee@mail.com',
            password: 'p'
        }

        let _id

        beforeEach(() => {
            return users.collection.insertOne(_user)
                .then((res) => {
                    _id = res.insertedId.toString()
                })
        })

        it('should succeed on removing user', () => {
            return users.remove(_id)
                .then(res => {
                    expect(res).to.exist
                    expect(res.deletedCount).to.equal(1)
                })
        })
    })

    after(() =>
        users.collection.deleteMany()
            .then(() => client.close())
    )
})