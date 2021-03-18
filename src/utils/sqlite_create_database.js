const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

// Read the SQL file
const dataSql = fs.readFileSync("./file_3.sql").toString();

// Setup the database connection
let db_file1 = new sqlite3.Database("file1", err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to the in-memory SQLite database.");
});

let db_file2 = new sqlite3.Database("file2", err => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Connected to the in-memory SQLite database.");
});

let db_file3 = new sqlite3.Database("file3", err => {
if (err) {
    return console.error(err.message);
}
console.log("Connected to the in-memory SQLite database.");
});
// Convert the SQL string to array so that you can run them one at a time.
const dataArr = dataSql.toString().split(");");


// db.serialize ensures that your queries are one after the other depending on which one came first in your `dataArr`
db_file3.serialize(() => {
    // db.run runs your SQL query against the DB
    db_file3.run("PRAGMA foreign_keys=OFF;");
    db_file3.run("BEGIN TRANSACTION;");
    // Loop through the `dataArr` and db.run each query
    dataArr.forEach(query => {
      if (query) {
        // Add the delimiter back to each query before you run them
        // In my case the it was `);`
        query += ");";
        db_file3.run(query, err => {
          if (err) throw err;
        });
      }
    });
    db_file3.run("COMMIT;");
  });