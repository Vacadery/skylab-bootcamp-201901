require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
// const FileStore = require('session-file-store')(session)
const logicFactory = require('./src/logic-factory')

const { env: { PORT }, argv: [, , port = PORT || 8080] } = process

const app = express()

app.use(session({
    secret: 'a secret phrase',
    resave: true,
    saveUninitialized: true,
    // store: new FileStore({
    //     path: './.sessions'
    // })
}))

app.use(express.static('public'))

app.set('view engine', 'pug')
app.set('views', './src/components')

const formBodyParser = bodyParser.urlencoded({ extended: false })

function pullFeedback(req) {
    const { session: { feedback } } = req

    req.session.feedback = null

    return feedback
}

function renderPage(content) {
    return `<html>
<head>
    <title>spotify</title>
    <link rel="stylesheet" type="text/css" href="style.css">
</head>
<body class="main">
    ${content}
</body>
</html>`
}

app.get('/', (req, res) => {
    res.render('landing')
})

app.get('/register', (req, res) => {
    const logic = logicFactory.create(req)

    if (logic.isUserLoggedIn) {
        res.redirect('/home')
    } else {
        const feedback = pullFeedback(req)

        res.render('register', { feedback })
    }
})

app.post('/register', formBodyParser, (req, res) => {
    const { body: { name, surname, email, password, passwordConfirm } } = req

    const logic = logicFactory.create(req)

    try {
        logic.registerUser(name, surname, email, password, passwordConfirm)
            .then(() => res.send(renderPage(`<section class="register">
        <h2>Registration confirmation</h2>
        Ok, user <strong>${email}</strong> successfully registered, please proceed to <a href="/login">login</a>.
        </form>
    </section>`)))
            .catch(({ message }) => {
                req.session.feedback = message

                res.redirect('/register')
            })
    } catch ({ message }) {
        req.session.feedback = message

        res.redirect('/register')
    }
})

app.get('/login', (req, res) => {
    const logic = logicFactory.create(req)

    if (logic.isUserLoggedIn) {
        res.redirect('/home')
    } else {
        const feedback = pullFeedback(req)

        res.render('login', { feedback })
    }
})

app.post('/login', formBodyParser, (req, res) => {
    const { body: { email, password } } = req

    const logic = logicFactory.create(req)

    try {
        logic.logInUser(email, password)
            .then(() => res.redirect('/home'))
            .catch(({ message }) => {
                req.session.feedback = message

                res.redirect('/login')
            })
    } catch ({ message }) {
        req.session.feedback = message

        res.redirect('/login')
    }
})

app.get('/home', (req, res) => {
    try {
        const { session: { feedback } } = req

        const logic = logicFactory.create(req)

        if (logic.isUserLoggedIn)
            logic.retrieveUser()
                .then(user => res.send(renderPage(`<section class="home">
        Welcome, ${user.name}!
        ${feedback ? `<section class="feedback feedback--error">
            ${feedback}
        </section>` : ''}
        <form action="/logout" method="post">
            <button type="submit">Logout</button>
        </form>
        <form action='/search' method="post">
            <input type="search" name="query" placegolder="search"/>
            <button type="submit">Search</button>
        </form>
    </section>`)))
                .catch(({ message }) => {
                    req.session.feedback = message

                    res.redirect('/home')
                })
        else res.redirect('/login')
    } catch ({ message }) {
        req.session.feedback = message

        res.redirect('/home')
    }
})

app.post('/search', formBodyParser, (req, res) => {
    const { body: { query } } = req

    try {
        res.redirect(`/search&${query}`)
    } catch ({ message }) {
        req.session.feedback = message

        res.redirect('/home')
    }
})

app.get('/search&:query', (req, res) => {
    const { params: { query } } = req

    const logic = logicFactory.create(req)

    try {
        if (logic.isUserLoggedIn) {
            logic.searchArtists(query)
            .then((items) => {
                const feedback = pullFeedback(req)
                res.render('artists', { feedback, items })
            })
        } else res.redirect('/login')
        
    } catch ({ message }) {
        req.session.feedback = message

        res.redirect('/home')
    }
})

app.get('/artist&:artistId', formBodyParser, (req, res) => {
    const { params: { artistId } } = req

    const logic = logicFactory.create(req)

    try {
        if (logic.isUserLoggedIn) {
            logic.retrieveAlbums(artistId)
            .then((items) => {
                const feedback = pullFeedback(req)
                res.render('albums', { feedback, items })
            })
        } else res.redirect('/login')

    } catch ({ message }) {
        req.session.feedback = message

        res.redirect('/home')
    }
})

app.get('/album&:albumId', formBodyParser, (req, res) => {
    const { params: { albumId } } = req

    req.session.albumId = albumId

    const logic = logicFactory.create(req)

    var play = false

    try {
        if (logic.isUserLoggedIn) {
            logic.retrieveTracks(albumId)
            .then((items) => {
                const feedback = pullFeedback(req)
                res.render('tracks', { feedback, items, albumId, play })
            })
            .catch ((error) => {debugger})
        } else res.redirect('/login')
        
    } catch ({ message }) {
        req.session.feedback = message

        res.redirect('/home')
    }
})

app.get('/track&:trackId', formBodyParser, (req, res) => {
    const { params: { trackId }, session: { albumId } } = req

    const logic = logicFactory.create(req)

    try {
        if (logic.isUserLoggedIn) {

            logic.retrieveTracks(albumId)
            .then((items) => {
                const feedback = pullFeedback(req)
                res.render('tracks2', { feedback, items, albumId })
            })
            .catch ((error) => {debugger})

            logic.retrieveTrack(trackId)
            .then((item) => {
                res.render('track', { item })
            })
        } else res.redirect('/login')
        
    } catch ({ message }) {
        req.session.feedback = message

        res.redirect('/home')
    }
})

app.post('/logout', (req, res) => {
    const logic = logicFactory.create(req)

    logic.logOutUser()

    res.redirect('/')
})

app.get('*', (req, res) => res.send(404, renderPage(`<section class="not-found">
        <h2>NOT FOUND</h2>

        Go <a href="/">Home</a>
    </section>`)))


app.listen(port, () => console.log(`server running on port ${port}`))