const mysql = require('mysql')

// Create connection
// const db = mysql.createPool({
//   host: 'us-cdbr-east-03.cleardb.com',
//   user: 'ba7ed8a7b42e3e',
//   password: 'c4e4f421',
//   database: 'heroku_e2c8bd264f11a5e'
// });

// Create connection
const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'clima_cell_assignment'
  })

mysqlConnection.on('error', err => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        // db error reconnect
        handleDisconnect();
    } else {
        throw err;
    }
    console.log('Database connected!');
})

const isEmpty = (value) => (
    value === undefined ||
    value === null ||
    value.length === 0 ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  )

const getAvgValue= (arr) => {
    return arr.reduce((a,v,i)=>
        (a*i+v)/(i+1));
}

const getMinMaxValues= (arr) => {
    return arr.reduce(({min, max}, v) => ({
      min: min < v ? min : v,
      max: max > v ? max : v,
    }), { min: arr[0], max: arr[0] });
  }

  const printJsonForecast = (forecastTime, temperature, precipitation) => {
    return JSON.stringify({ 
      "forecastTime": forecastTime, 
      "Temperature": temperature, 
      "Precipitation": precipitation
    });
  }

const getWeatherForecastData = async(tableNum, lon, lat, response) => {
    const forecastResult = new Array()
    await new Promise((resolve, reject) => {
        mysqlConnection.query('SELECT * FROM file? WHERE Longitude = ? AND Latitude = ?', [tableNum, lon, lat], function(err, results) {
            if (err) {
                console.log(err);
                return response.status(500).json();
            }
            if (isEmpty(results)) {
                console.log("Result empty");
                return response.end(JSON.stringify({ error: "Location Not Found..." }));
            } 
            forecastResult.push(results[0].forecast_time)
            forecastResult.push(results[0].Temperature_Celsius)
            forecastResult.push(results[0].Precipitation_Rate_mmhr)
            resolve();
        });
    })
    return forecastResult;
}

module.exports = {
    getWeatherForecastData,
    printJsonForecast,
    getMinMaxValues,
    getAvgValue,
    isEmpty
}