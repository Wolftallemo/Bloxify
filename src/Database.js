const { Client } = require('pg')
const dbconfig = require('./data/client.json')
const client = new Client({
    user: dbconfig.databaseUser,
    host: dbconfig.databaseAddress,
    database: dbconfig.databaseName,
    password: dbconfig.databasePassword,
    port: 5432,
})
if ((dbconfig.databaseUser) && (dbconfig.databaseAddress) && (dbconfig.databaseName) && (dbconfig.databasePassword)) client.connect()

module.exports = client
