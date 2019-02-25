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
    },

    addCommentToArtist: {
        post: require('./add-comment-to-artist/post')
    },

    listCommentsFromArtist: {
        get: require('./list-comment-from-artist/get')
    }
}
