const sqlite3 = require('sqlite3').verbose();
const db_file = []
// Setup the database connection
db_file[1] = new sqlite3.Database("file1", err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to the in-memory SQLite database table file1.");
});

db_file[2] = new sqlite3.Database("file2", err => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Connected to the in-memory SQLite database table file2.");
});

db_file[3] = new sqlite3.Database("file3", err => {
if (err) {
    return console.error(err.message);
}
console.log("Connected to the in-memory SQLite database table file3.");
});

//Retrieving All Rows
async function getAllFile() {
  await new Promise((resolve, reject) => {
      db_file1.all("SELECT * FROM file1 WHERE Longitude = -180 AND Latitude = -90", async(error, rows) => {
          if (error) throw error;
              rows.forEach((row) => {
                  console.log(row.forecast_time + " " + row.Temperature_Celsius);
              })
          })
      resolve();
  });
}

// Create connection
// const mysqlConnection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'clima_cell_assignment'
//   })

// mysqlConnection.on('error', err => {
//     if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//         // db error reconnect
//         handleDisconnect();
//     } else {
//         throw err;
//     }
//     console.log('Database connected!');
// })

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

//Retrieving date from tables
const weatherForecastDataFromTable = async(numberTable, lon, lat, response) => {
  var query = "SELECT * FROM file" + numberTable + " WHERE Longitude = ? AND Latitude = ?"
  const forecastResult = new Array()
  await new Promise((resolve, reject) => {
    db_file[numberTable].all(query, [lon, lat], function(err, results) {
          if (err) {
              console.log(err);
              return response.status(500).json();
          }
          if (isEmpty(results)) {
              console.log("Result empty");
              return response.end(JSON.stringify({ error: "Location Not Found..." }));
          } 
          results.forEach((result) => {
            forecastResult.push(result.forecast_time)
            forecastResult.push(result.Temperature_Celsius)
            forecastResult.push(result.Precipitation_Rate_mmhr)
          })
          resolve();
      });
  })
  return forecastResult;
}

module.exports = {
  weatherForecastDataFromTable,
  printJsonForecast,
  getMinMaxValues,
  getAvgValue,
  isEmpty
}