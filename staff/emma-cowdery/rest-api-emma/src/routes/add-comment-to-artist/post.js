const logic = require('../../logic')

module.exports = (req, res) => {
    const { params: { artistId }, body: { userId, comment }, headers: { authorization } } = req

    const token = authorization.substring(7)

    try {
        logic.addCommentToArtist(userId, token, artistId, comment)
            .then(res.json.bind(res))
            .catch(({ message }) => {
                res.status(409).json({
                    error: message
                })
            })
    } catch ({ message }) {
        res.status(409).json({
            error: message
        })
    }
}