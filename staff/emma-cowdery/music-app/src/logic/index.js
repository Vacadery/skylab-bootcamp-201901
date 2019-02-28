import users from '../data'
import musicApi from '../music-api'
import spotifyApi from '../spotify-api'
import userApi from '../user-api'

/**
 * Abstraction of business logic.
 */
const logic = {
    __userId__: null,
    __userApiToken__: null,

    /**
     * Logins a user by its credentials.
     * 
     * @param {string} email 
     * @param {string} password 
     * @param {function} callback 
     */
    login: function (email, password) {
        if (typeof email !== 'string') throw TypeError(`${email} is not a string`)
        if (!email.trim().length) throw Error('email cannot be empty')

        if (typeof password !== 'string') throw TypeError(`${password} is not a string`)
        if (!password.trim().length) throw Error('password cannot be empty')

        return musicApi.authenticateUser(email, password)
            .then(({ id, token}) => {
                this.__userId__ = id
                this.__userApiToken__ = token

                console.log(id)
                console.log(token)

                //return (id, token)
            })
            .then((token) => ({token}))
    },

    /**
     * Registers a user.
     * 
     * @param {string} name 
     * @param {string} surname 
     * @param {string} email 
     * @param {string} password 
     * @param {string} passwordConfirmation 
     * @param {function} callback 
     */
    register: function (name, surname, email, password, passwordConfirm) {
        if (typeof name !== 'string') throw TypeError(name + ' is not a string')
        if (!name.trim().length) throw Error('name cannot be empty')

        if (typeof surname !== 'string') throw TypeError(surname + ' is not a string')
        if (!surname.trim().length) throw Error('surname cannot be empty')

        if (typeof email !== 'string') throw TypeError(email + ' is not a string')
        if (!email.trim().length) throw Error('email cannot be empty')

        if (typeof password !== 'string') throw TypeError(password + ' is not a string')
        if (!password.trim().length) throw Error('password cannot be empty')

        if (typeof passwordConfirm !== 'string') throw TypeError(passwordConfirm + ' is not a string')
        if (!passwordConfirm.trim().length) throw Error('password confirmation cannot be empty')

        if (password !== passwordConfirm) throw Error('passwords do not match')

        return musicApi.registerUser(name, surname, email, password, passwordConfirm)
            .then(() => { })
    },

    retrieveUser() {
        return musicApi.retrieveUser(this.__userId__, this.__userApiToken__)
            .then(({ name, surname, email, id, token }) => ({
                name,
                surname,
                email,
                id,
                token
            }))
    },

    /**
     * 
     * @param {string} data 
     */
    updateUser(data) {
        if (typeof data !== 'string') throw TypeError(data + ' is not a string')
        if (!data.trim().length) throw Error('data cannot be empty')

        return musicApi.updateUser(this.__userId__, this.__userApiToken__, data)
            .then(() => { })
    },

    /**
     * 
     * @param {string} email 
     * @param {string} password 
     */
    removeUser(email, password) {
        if (typeof email !== 'string') throw TypeError(email + ' is not a string')
        if (!email.trim().length) throw Error('email cannot be empty')

        if (typeof password !== 'string') throw TypeError(password + ' is not a string')
        if (!password.trim().length) throw Error('password cannot be empty')

        return musicApi.removeUser(this.__userId__, this.__userApiToken__, email, password)
            .then(() => { })
    },

    get isUserLoggedIn() {
        return !!this.__userId__
    },

    logOutUser() {
        this.__userId__ = null
        this.__userApiToken__ = null
    },

    /**
     * Search artists
     * 
     * @param {string} query
     */
    
    searchArtists(query) {
        if (typeof query !== 'string') throw TypeError(`${query} is not a string`)

        if(!query.trim().length) throw Error('query is empty')

        return musicApi.searchArtists(query)
    },

    retrieveArtist(artistId) {
        if (typeof artistId !== 'string') throw TypeError(`${artistId} is not a string`)

        if(!artistId.trim().length) throw Error('artistId is empty')

        return musicApi.retrieveArtist(artistId)
    },

    // toggleFavouriteArtist(artistId) {
    //     return musicApi.toggleFavouriteArtist
    // },

    /**
     * Retrieves albums from artists
     * 
     * @param {string} artistId
     */
    retrieveAlbums(artistId) {
        if (typeof artistId !== 'string') throw TypeError(`${artistId} is not a string`)

        if(!artistId.trim().length) throw Error('artistId is empty')

        //if (typeof callback !== 'function') throw TypeError(`${callback} is not a function`)

        return musicApi.retrieveAlbums(artistId)
    },

    /**
     * 
     * @param {string} albumId 
     * @param {function} callback 
     */
    retrieveTracks(albumId) {
        if (typeof albumId !== 'string') throw TypeError(`${albumId} is not a string`)

        if(!albumId.trim().length) throw Error('albumId is empty')

        //if (typeof callback !== 'function') throw TypeError(`${callback} is not a function`)

        return spotifyApi.retrieveTracks(albumId)
    },

    /**
     * 
     * @param {string} id 
     * @param {function} callback 
     */
    retrieveTrack(id) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)

        if(!id.trim().length) throw Error('id is empty')

        //if (typeof callback !== 'function') throw TypeError(`${callback} is not a finction`)

        return spotifyApi.retrieveTrack(id)
    },

    /**
     * 
     * @param {string} email 
     * @param {string} songId 
     * @param {function} callback 
     */
    favouritedSongs(email, trackId, callback) {
        users.find(user => {
            
            if (user.email===email) {
                var index
                index = user.favourites.indexOf(trackId)
                if (index === -1) {
                    user.splice(index, 1)
                } else {
                    user.push(trackId)
                }
                return user.favourites
            }
            return callback(user.favourites)
        })

    }
}

export default logic