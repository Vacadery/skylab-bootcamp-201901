const logic = require('../logic')

module.exports = (req, res) => {
    const { params: { albumId } } = req
    try {
        logic.retrieveTracks(albumId)
            .then(res.json.bind(res))
            .catch(({ message }) => {
                res.status(400).json({
                    error: message
                })
            })
    } catch ({ message }) {
        res.status(400).json({
            error: message
        })
    }
}