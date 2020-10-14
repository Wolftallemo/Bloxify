const { Client } = require('pg')
const dbconfig = require('./data/client.json')
function getDbUser() {
    if (!dbconfig.databaseUser) {
        return 'postgres'
    }
    return dbconfig.databaseUser
}

function getDbName() {
    if (!dbconfig.databaseName) {
        return 'postgres'
    }
    return dbconfig.databaseName
}
const dbUser = getDbUser()
const dbName = getDbName()
const client = new Client({
    user: dbUser,
    host: dbconfig.databaseAddress,
    database: dbName,
    password: dbconfig.databasePassword,
    port: 5432,
})
if ((dbconfig.databaseAddress) && (dbconfig.databasePassword)) client.connect()

module.exports = client
