const logic = require('../logic')

module.exports = (req, res) => {
    const { params: { trackId }, body: { userId }, headers: { authorization } } = req

    const token = authorization.substring(7)

    try {
        logic.toggleFavoriteTrack(userId, token, trackId)
            .then(user => res.json({ user }))
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

//http://localhost:8000/api/track/4aebBr4JAihzJQR0CiIZJv
//5c77ed58326cbaa19d472482
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1Yzc3ZWQ1ODMyNmNiYWExOWQ0NzI0ODIiLCJpYXQiOjE1NTE0MzIwOTUsImV4cCI6MTU1MTQ0NjQ5NX0.2SRkJZWLswVe0-3Kq_eM2jDqXRBnOwwgef8628-2aiw