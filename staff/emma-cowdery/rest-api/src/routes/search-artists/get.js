const logic = require('../../logic')

module.exports = (req, res) => {
    const { query: { q } } = req

    try {
        logic.searchArtists(q)
        .then(res.json.bind(res))
            .catch(({ message }) => {
                res.status(401).json({
                    error: message
                })
            })
    } catch ({ message }) {
        res.status(401).json({
            error: message
        })
    }
}