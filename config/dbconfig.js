const mysql = require("mysql");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "2852",
  database: "software_2020_2",
});

module.exports = pool;
