const path = require('path')
const express = require('express')
const { getWeatherForecastData, printJsonForecast, getMinMaxValues, getAvgValue, isEmpty } = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// Handling with multiple tables
//var connection = mysqlConnection.createConnection({multipleStatements: true});

// Interaction task check connection with first table
app.get('/', async(req, res) => {
    let weatherForecastArray = await getWeatherForecastData(1, -180.0, -90.0, res)
    let jsonString = printJsonForecast(weatherForecastArray[0], weatherForecastArray[1], weatherForecastArray[2])
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(jsonString);
})
// Interaction task check connection with second table
app.get('/weather', async(req, res) => {
    let weatherForecastArray = await getWeatherForecastData(2, -180.0, -90.0, res)
    let jsonString = printJsonForecast(weatherForecastArray[0], weatherForecastArray[1], weatherForecastArray[2])
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(jsonString);
})

// http://localhost:3000/weather/data/-180/-90
app.get('/weather/data/:lon/:lat', async(req, res) => {
    if (!req.params.lon || !req.params.lat){
        JSON.stringify({ "error": "Please check again, you need to add Longitude AND Latitude." })
    }
    let jsonString = ""
    let weatherForecastArray = new Array()
    for (var i = 1; i < 4; i++) {
        weatherForecastArray = await getWeatherForecastData(i, req.params.lon, req.params.lat, res);
        jsonString += printJsonForecast(weatherForecastArray[0], weatherForecastArray[1], weatherForecastArray[2])
    }
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(jsonString);
})

// http://localhost:3000/weather/summarize/-180/-90
app.get('/weather/summarize/:lon/:lat', async(req, res) => {
    if (!req.params.lon || !req.params.lat){
        JSON.stringify({ "error": "Please check again, you need to add Longitude AND Latitude." })
    }
    let jsonString = ""
    let weatherForecastArray = new Array()
    let temperatureMinMax = new Array()
    let precipitatioMinMax = new Array()
    let temperatureAvg;
    let precipitatioAvg;
    for (var i = 1; i < 4; i++) {
        weatherForecastArray[i-1] = await getWeatherForecastData(i, req.params.lon, req.params.lat, res)
    }
    temperatureMinMax = getMinMaxValues([weatherForecastArray[0][1], weatherForecastArray[1][1], weatherForecastArray[2][1]])
    precipitatioMinMax = getMinMaxValues([weatherForecastArray[0][2], weatherForecastArray[1][2], weatherForecastArray[2][2]])
    temperatureAvg = getAvgValue([weatherForecastArray[0][1], weatherForecastArray[1][1], weatherForecastArray[2][1]])
    precipitatioAvg = getAvgValue([weatherForecastArray[0][2], weatherForecastArray[1][2], weatherForecastArray[2][2]])
    jsonString = JSON.stringify({
    "max": {
        "Temperature": temperatureMinMax.max,
        "Precipitation": precipitatioMinMax.max
    },
    "min": {
        "Temperature": temperatureMinMax.min,
        "Precipitation": precipitatioMinMax.min
    },
    "avg": {
        "Temperature": temperatureAvg.toString().match(/\d+\.\d{2}/)[0],
        "Precipitation": precipitatioAvg.toString().match(/\d+\.\d{2}/)[0]
    }
    })
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(jsonString);
})

app.get('*', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: "404" }));
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})