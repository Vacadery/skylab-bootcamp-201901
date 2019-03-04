module.exports = {
    registerUser: require('./register-user'),

    authenticateUser: require('./authenticate-user'),

    retrieveUser: require('./retrieve-user'),

    searchArtists: require('./search-artists'),

    addCommentToArtist: require('./add-comment-to-artist'),

    listCommentsFromArtist: require('./list-comments-from-artist'),

    retrieveAlbums: require('./retrieve-albums'),

    retrieveTracks: require('./retrieve-tracks'),

    retrieveTrack: require('./retrieve-track'),

    addFavouriteTrack: require('./add-favourite-track-to-user'),

    // TODO other route handlers

    notFound: require('./not-found')
}