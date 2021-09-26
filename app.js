//import dependencies
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
require('dotenv').config()

//initialize app and port
const app = express()
const SERVER_PORT = process.env.PORT || 8080

//import middleware
const { requireAuth, checkUser } = require('./middlewares/authMiddleware')

//connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((err) => {
    console.log(err)
  })
  .finally(() => {
    console.log('API up and connected to the cloud. Happy Hacking! =)')
  })

//set EJS as view engine
app.set('view engine', 'ejs')

//serve static files
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get('*', checkUser)
app.get('/', (req, res) => {
  res.redirect('/blog')
})

//import routes
const adminRoutes = require('./routes/adminRoutes')
const blogRoutes = require('./routes/blogRoutes')
const authRoutes = require('./routes/authRoutes')

//initialize routes
app.use('/', authRoutes)
app.use('/blog', blogRoutes)
app.use('/admin', requireAuth, adminRoutes)

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' })
})

//port running
app.listen(SERVER_PORT, () => {
  console.log(`Server is running on port ${SERVER_PORT}`)
})

//error handling
app.use((req, res) => res.status(404).render('404', { title: 'Error Page' }))
