const express = require('express')
const bodyParser = require('body-parser')
const logic = require('./src/logic')

const { argv: [, , port = 8080] } = process

const app = express()

const formBodyParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('public'))

let feedback = ''

app.get('/register', (req, res) => {
    res.send(`<html>
<head>
    <title>HELLO WORLD</title>
    <link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
    <h1>HELLO WORLD</h1>
    <section class="register">
        <h2>Register</h2>
        <form method="POST" action="/register">
        <input name="name" type="text" placeholder="name" required>
        <input name="surname" type="text" placeholder="surname" required>
        <input name="email" type="email" placeholder="email" required>
        <input name="password" type="password" placeholder="password" required>
        <input name="passwordConfirm" type="password" placeholder="confirm password" required>
        <button type="submit">Register</button>
        </form>
        ${feedback ? `<section class="feedback feedback--warn">
            ${feedback}
        </section>` : ''}
    </section>
    <button type="button" action="/login"><a href="/login">login</a></button>
</body>
</html>`)
})

app.post('/register', formBodyParser, (req, res) => {
    const { body: { name, surname, email, password, passwordConfirm } } = req

    try {
        logic.registerUser(name, surname, email, password, passwordConfirm)
            .then(() => res.send(`<html>
<head>
    <title>HELLO WORLD</title>
    <link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
    <h1>HELLO WORLD</h1>
    <section class="register">
        <h2>Registration confirmation</h2>
        Ok, user <strong>${email}</strong> successfully registered, please proceed to <a href="/login">login</a>.
        </form>
    </section>
</body>
</html>`))
            .catch(({ message }) => {
                feedback = message

                res.redirect('/register')
            })
    } catch ({ message }) {
        feedback = message

        res.redirect('/register')
    }
})

// TODO get and post login

app.get('/login', (req, res) => {
    res.send(`<html>
<head>
    <title>HELLO WORLD</title>
    <link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
    <h1>HELLO WORLD</h1>
    <section class="register">
        <h2>Login</h2>
        <form method="POST" action="/login">
        <input name="email" type="email" placeholder="email" required>
        <input name="password" type="password" placeholder="password" required>
        <button type="submit">Login</button>
        </form>
        ${feedback ? `<section class="feedback feedback--warn">
            ${feedback}
        </section>` : ''}
    </section>
    <button tyoe="button" action="/register"><a href="/register">register</a></button>
</body>
</html>`)
})

app.post('/login', formBodyParser, (req, res) => {
    const { body: { email, password } } = req

    try {
        logic.logInUser(email, password)
            .then(() => res.redirect('/home'))
            .catch(({ message }) => {
                feedback = message

                res.redirect('/login')
            })
    } catch ({ message }) {
        feedback = message

        res.redirect('/login')
    }
})

app.get('/home', (req, res) => {
    logic.retrieveUser()
        .then(user => 
            res.send(`<html>
    <head>
        <title>WELCOME TO HELL</title>
        <link rel="stylesheet" type="text/css" href="style.css">
    </head>
    <body>
        <h1>WELCOME TO HELL</h1>
        <section class="register">
            <h2>Login confirmation</h2>
            Ok, user <strong>${user.name}</strong> successfully logged in, please stay here and do nothing.
            </form>
        </section>
    </body>
    </html>`)
        )
    
})
// TODO get home (must control user is logged in)

app.listen(port, () => console.log(`server running on port ${port}`))