const { Client } = require('pg')
const client = new Client({
    user: config.databaseUser,
    host: config.databaseAddress,
    database: config.databaseName,
    password: config.databasePassword,
    port: 5432,
})

module.exports = client
