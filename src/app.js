const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

// Define Paths for express config
const publicDirectoryPath = path.join(__dirname,'../public')
const viewsPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')

//Setup Handlebars engine and views location
app.set('view engine','hbs')
app.set('views',viewsPath)
hbs.registerPartials(partialsPath)

//setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('',(req,res) => {
    res.render('index.hbs',{
        title:'Weather App',
        name:'Ujjal'
    })
})

app.get('/about',(req,res) =>{
    res.render('about.hbs',{
        title:'About Me',
        name:'Ujjal'
    })
})

app.get('/help',(req,res) =>{
    res.render('help.hbs',{
        title:'Help',
        name:'Ujjal',
        helpText:'Help Text'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    }
    geocode(req.query.address, (error, { latitude, longitude, location }={}) => {
        if (error) {
            return res.send({ error })
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/products',(req, res) => {
    if(!req.query.search){
        return res.send({
        error: 'you must provide a search term'
        })
    }
    console.log(req.query)
    res.send({
        product:[]
    })
})

app.get('/help/*',(req, res) => {
    res.render('404.hbs',{
        title: '404',
        errorMessage:'Help article not Found',
        name:'Ujjal'
    })
})

app.get('*',(req,res) => {
    res.render('404.hbs',{
        title: '404',
        errorMessage:'Page not Found',
        name:'Ujjal'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000')
})