'use strict'

const musicApi = {
    url: 'http://localhost:8000/api',

    /**
     * 
     * @param {string} name 
     * @param {string} surname 
     * @param {string} email 
     * @param {string} password 
     * @param {string} passwordConfirm 
     */
    registerUser(name, surname, email, password, passwordConfirm) {
        if (typeof name !== 'string') throw TypeError(`${name} is not a string`)
        if (!name.trim().length) throw Error('name is empty')

        if (typeof surname !== 'string') throw TypeError(`${surname} is not a string`)
        if (!surname.trim().length) throw Error('surname is empty')

        if (typeof email !== 'string') throw TypeError(`${email} is not a string`)
        if (!email.trim().length) throw Error('email is empty')

        if (typeof password !== 'string') throw TypeError(`${password} is not a string`)
        if (!password.trim().length) throw Error('password is empty')

        if (typeof passwordConfirm !== 'string') throw TypeError(`${passwordConfirm} is not a string`)
        if (!passwordConfirm.trim().length) throw Error('password confirm is empty')

        return fetch(`${this.url}/user`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ name, surname, email, password, passwordConfirm })
        })
        .then(response => response.json())
        .then(({ id, error }) => {
            if (error) throw Error(error)

            return id
        })
    },

    /**
     * 
     * @param {string} email 
     * @param {string} password 
     */
    authenticateUser(email, password) {
        if (typeof email !== 'string') throw TypeError(`${email} is not a string`)
        if (!email.trim().length) throw Error('email is empty')

        if (typeof password !== 'string') throw TypeError(`${password} is not a string`)
        if (!password.trim().length) throw Error('password is empty')

        return fetch(`${this.url}/auth`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => {
            debugger
            return response.json()
        })
        .then(response => response)
    },

    /**
     * 
     * @param {string} id 
     * @param {string} token 
     */
    retrieveUser(id, token) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)
        if (!id.trim().length) throw Error('id is empty')

        if (typeof token !== 'string') throw TypeError(`${token} is not a string`)
        if (!token.trim().length) throw Error('token is empty')

        return fetch(`${this.url}/user/${id}`, {
            headers: {
                authorization: `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(response => {
            if (response.error) throw Error(response.error)

            return response
        })
    },

    /**
     * 
     * @param {string} id 
     * @param {string} token 
     * @param {object} data 
     */
    updateUser(id, token, data) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)
        if (!id.trim().length) throw Error('id is empty')

        if (typeof token !== 'string') throw TypeError(`${token} is not a string`)
        if (!token.trim().length) throw Error('token is empty')

        if (data.constructor !== Object) throw TypeError(`${data} is not an object`)

        return fetch(`${this.url}/user/${id}`, {
            method: 'PUT',
            headers: {
                authorization: `Bearer ${token}`,
                'content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(response => {
            if (response.error) throw Error(response.error)

            return response
        })
    },

    /**
     * 
     * @param {string} id 
     * @param {string} token 
     * @param {string} email 
     * @param {string} password 
     */
    removeUser(id, token, email, password) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)
        if (!id.trim().length) throw Error('id is empty')

        if (typeof token !== 'string') throw TypeError(`${token} is not a string`)
        if (!token.trim().length) throw Error('token is empty')

        if (typeof email !== 'string') throw TypeError(`${email} is not a string`)
        if (!email.trim().length) throw Error('email is empty')

        if (typeof password !== 'string') throw TypeError(`${password} is not a string`)
        if (!password.trim().length) throw Error('password is empty')

        return fetch(`${this.url}/user/${id}`, {
            method: 'DELETE',
            headers: {
                authorization: `Bearer ${token}`,
                'content-type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(response => {
            if (response.error) throw Error(response.error)

            return response
        })
    },

    /**
     * 
     * @param {string} query 
     */
    searchArtists(query) {
        if (typeof query !== 'string') throw TypeError(`${query} is not a string`)
        if (!query.trim().length) throw Error('query is empty')

        return fetch (`${this.url}/artists?q=${query}`)
            .then(response => response.json())
            .then(response => {
                if (response.error) throw Error(response.error)

                return response
            })
    },

    /**
     * 
     * @param {string} artistId 
     */
    retrieveArtist(artistId) {
        if (typeof artistId !== 'string') throw TypeError(`${artistId} is not a string`)
        if (!artistId.trim().length) throw Error('artistId is empty')

        return fetch(`${this.url}/artists/${artistId}`)
            .then(response => response.json())
    },

    /**
     * 
     * @param {string} userId 
     * @param {string} token 
     * @param {string} artistId 
     * @param {string} text 
     */
    addCommentToArtist(userId, token, artistId, text) {
        if (typeof userId !== 'string') throw TypeError(`${userId} is not a string`)
        if (!userId.trim().length) throw Error('userId is empty')

        if (typeof token !== 'string') throw TypeError(`${token} is not a string`)
        if (!token.trim().length) throw Error('token is empty')

        if (typeof artistId !== 'string') throw TypeError(`${artistId} is not a string`)
        if (!artistId.trim().length) throw Error('artistId is empty')

        if (typeof text !== 'string') throw TypeError(`${text} is not a string`)
        if (!text.trim().length) throw Error('text is empty')

        return fetch(`${this.url}/artist/${artistId}/comment`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ userId, text })
        })
        .then(response => response.json())
        .then(response => {
            if (response.error) throw Error(response.error)

            return response
        })
    },

    /**
     * 
     * @param {string} artistId 
     */
    retrieveAlbums(artistId) {
        if (typeof artistId !== 'string') throw TypeError(`${artistId} is not a string`)
        if (!artistId.trim().length) throw Error('artistId is empty')

        return fetch(`${this.url}/artists/${artistId}/albums`)
            .then(response => response.json())
            .then(({ items }) => items)
    },

    /**
     * 
     * @param {string} albumId 
     */
    retrieveAlbum(albumId) {
        if (typeof albumId !== 'string') throw TypeError(`${albumId} is not a string`)
        if (!albumId.trim().length) throw Error('albumId is empty')

        return fetch(`${this.url}/albums/${albumId}`)
            .then(response => response.json())
    },

    /**
     * 
     * @param {string} albumId 
     */
    retrieveTracks(albumId) {
        if (typeof albumId !== 'string') throw TypeError(`${albumId} is not a string`)
        if (!albumId.trim().length) throw Error('albumId is empty')

        return fetch(`${this.url}/albums/${albumId}/tracks`)
            .then(response => response.json())
            .then(({ items }) => items)
    },

    retrieveTrack(trackId) {
        if (typeof trackId !== 'string') throw TypeError(`${trackId} is not a string`)
        if (!trackId.trim().length) throw Error('trackId is empty')

        return fetch(`${this.url}/tracks/${trackId}`)
            .then(response => response.json())
    }
}

export default musicApi