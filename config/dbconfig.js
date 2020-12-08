const mysql = require("mysql");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "0000",
  database: "software_2020_2",
});

module.exports = pool;
