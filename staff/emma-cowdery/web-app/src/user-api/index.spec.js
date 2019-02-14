'use strict'

const { expect } = require('chai')
const userApi = require('.')

describe('user api', () => {
    describe('register', () => {
        const name = 'Manuel'
        const surname = 'Barzi'
        const username = `manuelbarzi-${Math.random()}`
        const password = '123'

        it('should succeed on correct data', () =>
            userApi.register(name, surname, username, password)
                .then(id => expect(id).to.exist)
        )

        it('should fail on already existing user', () =>
            userApi.register(name, surname, username, password)
                .then(() => {
                    throw Error('should not have passed by here')
                })
                .catch(error => {
                    expect(error).to.exist
                    expect(error.message).to.equal(`user with username \"${username}\" already exists`)
                })
        )

        it('should fail on empty name', () => 
            expect(() => {
                userApi.register('', surname, username, password)
            }).to.throw(Error, 'name is empty')
        )

        it('should fail on number for name', () => 
            expect(() => {
                userApi.register(2, surname, username, password)
            }).to.throw(Error, '2 is not a string')
        )

        it('should fail on array for name', () => 
            expect(() => {
                userApi.register([], surname, username, password)
            }).to.throw(Error, ' is not a string')
        )

        it('should fail on object for name', () => 
            expect(() => {
                userApi.register({}, surname, username, password)
            }).to.throw(Error, '[object Object] is not a string')
        )

        it('should fail on boolean for name', () => 
            expect(() => {
                userApi.register(true, surname, username, password)
            }).to.throw(Error, 'true is not a string')
        )

        it('should fail on empty surname', () => 
            expect(() => {
                userApi.register(name, '', username, password)
            }).to.throw(Error, 'surname is empty')
        )

        it('should fail on number for surname', () => 
            expect(() => {
                userApi.register(name, 2, username, password)
            }).to.throw(Error, '2 is not a string')
        )

        it('should fail on array for surname', () => 
            expect(() => {
                userApi.register(name, [], username, password)
            }).to.throw(Error, ' is not a string')
        )

        it('should fail on object for surname', () => 
            expect(() => {
                userApi.register(name, {}, username, password)
            }).to.throw(Error, '[object Object] is not a string')
        )

        it('should fail on boolean for surname', () => 
            expect(() => {
                userApi.register(name, true, username, password)
            }).to.throw(Error, 'true is not a string')
        )

        it('should fail on empty username', () => 
            expect(() => {
                userApi.register(name, surname, '', password)
            }).to.throw(Error, 'username is empty')
        )

        it('should fail on number for username', () => 
            expect(() => {
                userApi.register(name, surname, 2, password)
            }).to.throw(Error, '2 is not a string')
        )

        it('should fail on array for username', () => 
            expect(() => {
                userApi.register(name, surname, [], password)
            }).to.throw(Error, ' is not a string')
        )

        it('should fail on object for username', () => 
            expect(() => {
                userApi.register(name, surname, {}, password)
            }).to.throw(Error, '[object Object] is not a string')
        )

        it('should fail on boolean for username', () => 
            expect(() => {
                userApi.register(name, surname, true, password)
            }).to.throw(Error, 'true is not a string')
        )

        it('should fail on empty password', () => 
            expect(() => {
                userApi.register(name, surname, username, '')
            }).to.throw(Error, 'password is empty')
        )

        it('should fail on number for password', () => 
            expect(() => {
                userApi.register(name, surname, username, 2)
            }).to.throw(Error, '2 is not a string')
        )

        it('should fail on array for password', () => 
            expect(() => {
                userApi.register(name, surname, username, [])
            }).to.throw(Error, ' is not a string')
        )

        it('should fail on object for password', () => 
            expect(() => {
                userApi.register(name, surname, username, {})
            }).to.throw(Error, '[object Object] is not a string')
        )

        it('should fail on boolean for password', () => 
            expect(() => {
                userApi.register(name, surname, username, true)
            }).to.throw(Error, 'true is not a string')
        )


        // TODO more unit test cases
    })

    describe('authenticate', () => {
        const name = 'Manuel'
        const surname = 'Barzi'
        const username = `manuelbarzi-${Math.random()}`
        const password = '123'

        let _id

        beforeEach(() =>
            userApi.register(name, surname, username, password)
                .then(id => _id = id)
        )

        it('should succeed on correct data', () =>
            userApi.authenticate(username, password)
                .then(({ id, token }) => {
                    expect(id).to.equal(_id)
                    expect(token).to.exist
                })
        )

        it('should fail on empty username', () => 
            expect(() => {
                userApi.register('', password)
            }).to.throw(Error, 'username is empty')
        )

        it('should fail on number for username', () => 
            expect(() => {
                userApi.register(2, password)
            }).to.throw(Error, '2 is not a string')
        )

        it('should fail on array for username', () => 
            expect(() => {
                userApi.register([], password)
            }).to.throw(Error, ' is not a string')
        )

        it('should fail on object for username', () => 
            expect(() => {
                userApi.register({}, password)
            }).to.throw(Error, '[object Object] is not a string')
        )

        it('should fail on boolean for username', () => 
            expect(() => {
                userApi.register(true, password)
            }).to.throw(Error, 'true is not a string')
        )

        it('should fail on empty password', () => 
            expect(() => {
                userApi.register(username, '')
            }).to.throw(Error, 'password is empty')
        )

        it('should fail on number for password', () => 
            expect(() => {
                userApi.register(username, 2)
            }).to.throw(Error, '2 is not a string')
        )

        it('should fail on array for password', () => 
            expect(() => {
                userApi.register(username, [])
            }).to.throw(Error, ' is not a string')
        )

        it('should fail on object for password', () => 
            expect(() => {
                userApi.register(username, {})
            }).to.throw(Error, '[object Object] is not a string')
        )

        it('should fail on boolean for password', () => 
            expect(() => {
                userApi.register(username, true)
            }).to.throw(Error, 'true is not a string')
        )

        // TODO more unit test cases
    })

    describe('retrieve', () => {
        const name = 'Manuel'
        const surname = 'Barzi'
        const username = `manuelbarzi-${Math.random()}`
        const password = '123'

        let _id, _token

        beforeEach(() =>
            userApi.register(name, surname, username, password)
                .then(id => _id = id)
                .then(() => userApi.authenticate(username, password))
                .then(({ token }) => _token = token)
        )

        it('should succeed on correct data', () =>
            userApi.retrieve(_id, _token)
                .then(user => {
                    expect(user.id).to.equal(_id)
                    expect(user.name).to.equal(name)
                    expect(user.surname).to.equal(surname)
                    expect(user.username).to.equal(username)
                })
        )

        // TODO more unit test cases
    })

    describe('update', () => {
        const name = 'Manuel'
        const surname = 'Barzi'
        const username = `manuelbarzi-${Math.random()}`
        const password = '123'

        let _id, _token

        beforeEach(() =>
            userApi.register(name, surname, username, password)
                .then(id => _id = id)
                .then(() => userApi.authenticate(username, password))
                .then(({ token }) => _token = token)
        )

        it('should succeed on correct data', () => {
            const data = { name: 'Pepito', surname: 'Grillo', age: 32 }

            return userApi.update(_id, _token, data)
                .then(() => userApi.retrieve(_id, _token))
                .then(user => {
                    expect(user.id).to.equal(_id)
                    expect(user.name).to.equal(data.name)
                    expect(user.surname).to.equal(data.surname)
                    expect(user.age).to.equal(data.age)
                    expect(user.username).to.equal(username)
                })
        })

        // TODO more unit test cases
    })

    describe('remove', () => {
        const name = 'Manuel'
        const surname = 'Barzi'
        const username = `manuelbarzi-${Math.random()}`
        const password = '123'

        let _id, _token

        beforeEach(() =>
            userApi.register(name, surname, username, password)
                .then(id => _id = id)
                .then(() => userApi.authenticate(username, password))
                .then(({ token }) => _token = token)
        )

        it('should succeed on correct data', () => {
            return userApi.remove(_id, _token, username, password)
                .then(() => userApi.retrieve(_id, _token))
                .then(() => {
                    throw Error('should not pass by here')
                })
                .catch(({message}) => expect(message).to.equal(`user with id \"${_id}\" does not exist`))
        })

        // TODO more unit test cases
    })
})