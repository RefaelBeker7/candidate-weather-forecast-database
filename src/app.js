const express = require('express')
const { weatherForecastDataFromTable, JsonifyForecast, getMinMaxValues, getAvgValue, isEmpty } = require('./utils/forecast')
const app = express()

const port = process.env.PORT || 3000


// Interaction task check connection with first table
app.get('/', async(req, res) => {
    let weather_forecast_array = await weatherForecastDataFromTable(1, -180.0, -90.0, res)
    let json_stringify = JsonifyForecast(weather_forecast_array[0], weather_forecast_array[1], weather_forecast_array[2])
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(json_stringify);
})

app.get('/weather', async(req, res) => {
    let weather_forecast_array = await weatherForecastDataFromTable(1, -180.0, -90.0, res)
    let json_stringify = JsonifyForecast(weather_forecast_array[0], weather_forecast_array[1], weather_forecast_array[2])
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(json_stringify);
})

// /weather/data/-180/-90
app.get('/weather/data/:lon/:lat', async(req, res) => {
    if (!req.params.lon || !req.params.lat){
        JSON.stringify({ "error": "Please check again, you need to add Longitude AND Latitude." })
    }
    let json_stringify = ""
    let weather_forecast_array = new Array()
    for (var i = 1; i < 4; i++) {
        weather_forecast_array = await weatherForecastDataFromTable(i, req.params.lon, req.params.lat, res);
        json_stringify += JsonifyForecast(weather_forecast_array[0], weather_forecast_array[1], weather_forecast_array[2])
    }
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(json_stringify);
})

// /weather/summarize/-180/-90
app.get('/weather/summarize/:lon/:lat', async(req, res) => {
    if (!req.params.lon || !req.params.lat){
        JSON.stringify({ "error": "Please check again, you need to add Longitude AND Latitude." })
    }
    let json_stringify = ""
    let weather_forecast_array = new Array()
    let temperature_min_max = new Array()
    let precipitatio_min_max = new Array()
    let temperature_avg;
    let precipitatio_avg;
    for (var i = 1; i < 4; i++) {
        weather_forecast_array[i-1] = await weatherForecastDataFromTable(i, req.params.lon, req.params.lat, res)
    }
    temperature_min_max = getMinMaxValues([weather_forecast_array[0][1], weather_forecast_array[1][1], weather_forecast_array[2][1]])
    precipitatio_min_max = getMinMaxValues([weather_forecast_array[0][2], weather_forecast_array[1][2], weather_forecast_array[2][2]])
    temperature_avg = getAvgValue([weather_forecast_array[0][1], weather_forecast_array[1][1], weather_forecast_array[2][1]])
    precipitatio_avg = getAvgValue([weather_forecast_array[0][2], weather_forecast_array[1][2], weather_forecast_array[2][2]])
    json_stringify = JSON.stringify({
    "max": {
        "Temperature": temperature_min_max.max,
        "Precipitation": precipitatio_min_max.max
    },
    "min": {
        "Temperature": temperature_min_max.min,
        "Precipitation": precipitatio_min_max.min
    },
    "avg": {
        "Temperature": ((temperature_avg.toString().indexOf('.') > 0) && (temperature_avg.toString().split('.')[1].length > 1)) ? temperature_avg.toString().match(/\d+\.\d{2}/)[0] : temperature_avg.toString(),
        "Precipitation": ((precipitatio_avg.toString().indexOf('.') > 0) && (precipitatio_avg.toString().split('.')[1].length > 1)) ? precipitatio_avg.toString().match(/\d+\.\d{2}/)[0] : precipitatio_avg.toString()
    }
    })
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(json_stringify);
})

app.get('*', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: "404" }));
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})