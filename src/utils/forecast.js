const sqlite3 = require('sqlite3').verbose();
const database_tables = []

// Setup the database connection
database_tables[0] = new sqlite3.Database("file1", err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to the in-memory SQLite database table file1.");
});

database_tables[1] = new sqlite3.Database("file2", err => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Connected to the in-memory SQLite database table file2.");
});

database_tables[2] = new sqlite3.Database("file3", err => {
if (err) {
    return console.error(err.message);
}
console.log("Connected to the in-memory SQLite database table file3.");
});

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

  const JsonifyForecast = (forecast_time, temperature, precipitation) => {
    return JSON.stringify({ 
      "forecastTime": forecast_time, 
      "Temperature": temperature, 
      "Precipitation": precipitation
    });
  }

//Retrieving date from tables
const weatherForecastDataFromTable = async(number_table, lon, lat, response) => {
  var query = "SELECT * FROM file" + number_table + " WHERE Longitude = ? AND Latitude = ?"
  const forecast_result = new Array()
  await new Promise((resolve, reject) => {
    database_tables[number_table-1].all(query, [lon, lat], function(err, results) {
          if (err) {
              console.log(err);
              return response.status(500).json();
          }
          if (isEmpty(results)) {
              console.log("Result empty");
              return response.end(JSON.stringify({ error: "Location Not Found..." }));
          } 
          results.forEach((result) => {
            forecast_result.push(result.forecast_time)
            forecast_result.push(result.Temperature_Celsius)
            forecast_result.push(result.Precipitation_Rate_mmhr)
          })
          resolve();
      });
  })
  return forecast_result;
}

module.exports = {
  weatherForecastDataFromTable,
  JsonifyForecast,
  getMinMaxValues,
  getAvgValue,
  isEmpty
}