const mysql = require('mysql2/promise')

const db = mysql.createPool({
    host: "localhost",
    user: "fetti",
    password: "Ayoub@2002fetti",
    database: "workshop"
});

module.exports = db;