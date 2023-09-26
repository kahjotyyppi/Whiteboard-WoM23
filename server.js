const express = require('express')
const cors = require('cors')
const app = express()
const auth = require('./middleware/auth')
const PORT = process.env.PORT || 3030

app.use(cors())
app.use(express.json())

const usersRouter = require('./routes/users.js')
app.use('/users', usersRouter)

//app.use('/public', express.static(__dirname + '/frontend/public'))

// middleware-function
app.use(auth)

const boardsRouter = require('./routes/boards.js')
app.use('/boards', boardsRouter)

const notesRouter = require('./routes/notes.js')
app.use('/notes', notesRouter)


console.log("Server started!") 

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`)
})