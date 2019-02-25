'use strict'

const spotifyApi = require('../spotify-api')
const userApi = require('../user-api')
const users = require('../data/users')
const artistComments = require('../data/artist-comments')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const { env: {  SECRET } } = process

/**
 * Abstraction of business logic.
 */
const logic = {
    /**
    * Registers a user.
    * 
    * @param {string} name 
    * @param {string} surname 
    * @param {string} email 
    * @param {string} password 
    * @param {string} passwordConfirmation 
    */
    registerUser(name, surname, email, password, passwordConfirmation) {
        if (typeof name !== 'string') throw TypeError(name + ' is not a string')

        if (!name.trim().length) throw Error('name cannot be empty')

        if (typeof surname !== 'string') throw TypeError(surname + ' is not a string')

        if (!surname.trim().length) throw Error('surname cannot be empty')

        if (typeof email !== 'string') throw TypeError(email + ' is not a string')

        if (!email.trim().length) throw Error('email cannot be empty')

        if (typeof password !== 'string') throw TypeError(password + ' is not a string')

        if (!password.trim().length) throw Error('password cannot be empty')

        if (typeof passwordConfirmation !== 'string') throw TypeError(passwordConfirmation + ' is not a string')

        if (!passwordConfirmation.trim().length) throw Error('password confirmation cannot be empty')

        if (password !== passwordConfirmation) throw Error('passwords do not match')

        return users.add({ name, surname, email, password })
    },

    /**
     * Authenticates user by its credentials.
     * 
     * @param {string} email 
     * @param {string} password 
     */
    authenticateUser(email, password) {
        if (typeof email !== 'string') throw TypeError(email + ' is not a string')

        if (!email.trim().length) throw Error('email cannot be empty')

        if (typeof password !== 'string') throw TypeError(password + ' is not a string')

        if (!password.trim().length) throw Error('password cannot be empty')

        // return userApi.authenticate(email, password)
        // TODO redo authenticate here, using users driver to find user by email, verify password, generate token using jsonwebtoken
        return users.findByEmail(email)
            .then(user => {
                if (!user) throw Error(`user with email ${email} not found`)

                return bcrypt.compare(password, user.password)
                    .then(match => {
                        debugger
                        if (!match) throw Error ('wrong credentials')

                        const { id } = user

                        const token = jwt.sign({data: user._id}, this.SECRET, {expiresIn: '144h'})

                        return { id, token }
                    })
            })
            .catch((error) => error.message)
    },

    retrieveUser(id, token) {
        if (typeof id !== 'string') throw TypeError(id + ' is not an string')

        if (!id.trim().length) throw Error ('id is empty')

        if (typeof token !== 'string') throw TypeError(token + ' is not an string')

        if (!token.trim().length) throw Error ('token is empty')

        return users.retrieve(id) 
            .then(user => {
                jwt.verify(token, SECRET, (error, decoded) => {
                    if (error) throw Error(error.message)

                    if (decoded.id !== id) throw Error(`user with id ${id} doesn't match with token ${token}`)

                    return user
                })
            })
            .then(({ name, surname, email}) => ({
                name,
                surname,
                email
            }))
        
        // return userApi.retrieve(userId, token)
        //     .then(({ id, name, surname, username: email, favoriteArtists = [], favoriteAlbums = [], favoriteTracks = [] }) => ({
        //         id,
        //         name,
        //         surname,
        //         email,
        //         favoriteArtists,
        //         favoriteAlbums,
        //         favoriteTracks
        //     }))
    },

    // TODO updateUser and removeUser

    updateUser(id, token, updates) {
        if (typeof id !== 'string') throw TypeError(id + ' is not an string')

        if (!id.trim().length) throw Error ('id is empty')

        if (typeof token !== 'string') throw TypeError(token + ' is not an string')

        if (!token.trim().length) throw Error ('token is empty')

        if (constructor.updates !== Object) throw TypeError(updates + ' is not an object')

        if (typeof token !== 'string') throw TypeError(token + ' is not an string')

        if (!token.trim().length) throw Error ('token is empty')

        return users.update(user, updates)
            .then(res => res)
    },

    removeUser(id, token) {
        if (typeof id !== 'string') throw TypeError(id + ' is not an string')

        if (!id.trim().length) throw Error ('id is empty')

        if (typeof token !== 'string') throw TypeError(token + ' is not an string')

        if (!token.trim().length) throw Error ('token is empty')

        return users.remove(user)
            .then(res => res)
    },

    /**
     * Search artists.
     * 
     * @param {string} query 
     * @returns {Promise}
     */
    searchArtists(query) {
        if (typeof query !== 'string') throw TypeError(`${query} is not a string`)

        if (!query.trim().length) throw Error('query is empty')

        return spotifyApi.searchArtists(query)
    },

    /**
     * Retrieves an artist.
     * 
     * @param {string} artistId 
     */
    retrieveArtist(artistId) {
        if (typeof artistId !== 'string') throw TypeError(`${artistId} is not a string`)

        if (!artistId.trim().length) throw Error('artistId is empty')

        return spotifyApi.retrieveArtist(artistId)
        // TODO once artistComment is already implemented
        // .then(artist =>
        //     artistComment.find({ artistId: artist.id })
        //         .then(comments => artist.comments = comments)
        //         .then(() => artist)
        // )
    },

    /**
     * Toggles a artist from non-favorite to favorite, and viceversa.
     * 
     * @param {string} artistId - The id of the artist to toggle in favorites.
     */
    toggleFavoriteArtist(userId, token, artistId) {
        return userApi.retrieve(userId, token)
            .then(user => {
                const { favoriteArtists = [] } = user

                const index = favoriteArtists.findIndex(_artistId => _artistId === artistId)

                if (index < 0) favoriteArtists.push(artistId)
                else favoriteArtists.splice(index, 1)

                return userApi.update(userId, token, { favoriteArtists })
            })
    },

    addCommentToArtist(userId, token, artistId, text) {
        if (typeof userId !== 'string') throw TypeError(userId + ' is not an string')

        if (!userId.trim().length) throw Error ('userId is empty')

        if (typeof token !== 'string') throw TypeError(token + ' is not an string')

        if (!token.trim().length) throw Error ('token is empty')

        if (typeof artistId !== 'string') throw TypeError(artistId + ' is not an string')

        if (!artistId.trim().length) throw Error ('artistId is empty')

        if (typeof text !== 'string') throw TypeError(text + ' is not an string')

        if (!text.trim().length) throw Error ('text is empty')

        const comment = {
            userId,
            artistId,
            text,
            date: new Date
        }

        return userApi.retrieve(userId, token)
            .then(() => spotifyApi.retrieveArtist(artistId))
            .then(({ error }) => {
                if (error) throw Error(error.message)
            })
            .then(() => artistComments.add(comment))
            .then(() => comment.id)
    },

    listCommentsFromArtist(artistId) {
        if (typeof artistId !== 'string') throw TypeError(artistId + ' is not an string')

        if (!artistId.trim().length) throw Error ('artistId is empty')

        return artistComments.find({ artistId })
    },

    /**
     * Retrieves albums from artist.
     * 
     * @param {string} artistId 
     */
    retrieveAlbums(artistId) {
        if (typeof artistId !== 'string') throw TypeError(`${artistId} is not a string`)

        if (!artistId.trim().length) throw Error('artistId is empty')

        return spotifyApi.retrieveAlbums(artistId)
    },

    /**
     * Retrieves an album.
     * 
     * @param {string} albumId 
     */
    retrieveAlbum(albumId) {
        if (typeof albumId !== 'string') throw TypeError(`${albumId} is not a string`)

        if (!albumId.trim().length) throw Error('albumId is empty')

        return spotifyApi.retrieveAlbum(albumId)
    },

    /**
     * Toggles a album from non-favorite to favorite, and viceversa.
     * 
     * @param {string} albumId - The id of the album to toggle in favorites.
     */
    toggleFavoriteAlbum(userId, token, albumId) {
        return userApi.retrieve(userId, token)
            .then(user => {
                const { favoriteAlbums = [] } = user

                const index = favoriteAlbums.findIndex(_albumId => _albumId === albumId)

                if (index < 0) favoriteAlbums.push(albumId)
                else favoriteAlbums.splice(index, 1)

                return userApi.update(userId, token, { favoriteAlbums })
            })
    },

    /**
     * Retrieves tracks from album.
     * 
     * @param {string} albumId 
     */
    retrieveTracks(albumId) {
        if (typeof albumId !== 'string') throw TypeError(`${albumId} is not a string`)

        if (!albumId.trim().length) throw Error('albumId is empty')

        return spotifyApi.retrieveTracks(albumId)
    },

    /**
     * Retrieves track.
     * 
     * @param {string} trackId 
     */
    retrieveTrack(trackId) {
        if (typeof trackId !== 'string') throw TypeError(`${trackId} is not a string`)

        if (!trackId.trim().length) throw Error('trackId is empty')

        return spotifyApi.retrieveTrack(trackId)
    },

    /**
     * Toggles a track from non-favorite to favorite, and viceversa.
     * 
     * @param {string} trackId - The id of the track to toggle in favorites.
     */
    toggleFavoriteTrack(userId, token, trackId) {
        return userApi.retrieve(userId, token)
            .then(user => {
                const { favoriteTracks = [] } = user

                const index = favoriteTracks.findIndex(_trackId => _trackId === trackId)

                if (index < 0) favoriteTracks.push(trackId)
                else favoriteTracks.splice(index, 1)

                return userApi.update(userId, token, { favoriteTracks })
            })
    }
}

module.exports = logic