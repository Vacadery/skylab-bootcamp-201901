module.exports = {
    register: {
        post: require('./register/post')
    },

    authenticate: {
        post: require('./authenticate/post')
    },

    retrieve: {
        get: require('./retrieve/get')
    },

    // notFound: {
    //     get: require('./not-found/get')
    // }

    searchArtists: {
        get: require('./search-artists/get')
    }
}