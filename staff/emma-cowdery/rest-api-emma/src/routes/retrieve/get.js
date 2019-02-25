const logic = require('../../logic')

module.exports = (req, res) => {
    const { params: { userId }, headers: { authorization } } = req
    
    const token = authorization.split(' ')[1]
    //const [, token] = authorization.split(' ')

    try {
        logic.retrieveUser(userId, token)
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