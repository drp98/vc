const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const exphbs = require('express-handlebars')
const appRoutes = require('./routes/router')

const PORT = process.env.PORT || 3000

const app = express()

app.use('/api/auth', require('./routes/auth.routes'))

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: { 
        json: function (context) { 
            return JSON.stringify(context); 
        }
    }
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))

app.use(express.json({limit: '1mb'}))

app.use(appRoutes)

app.use(function(req, res, next) {
    res.status(404).sendFile(path.join(__dirname, 'public/404.html'));
});

async function start() {
    try {
        await mongoose.connect(process.env.MONGODB_URI,
            {
                useNewUrlParser: true,
                useFindAndModify: false,
                useUnifiedTopology: true
            }
        )
        app.listen(PORT, () => {
            console.log('Server has been started...')
        })
    } catch(e) {
        console.log(e);
    }
}

start()