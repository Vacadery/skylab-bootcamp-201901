const logic = require('../../logic')

module.exports = (req, res) => {
    const { params: { artistId } } = req
    
     try {
        logic.listCommentsFromArtist(artistId)
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

   