const Command = require('../Command')
const { Client } = require('pg')
const config = require('../../data/client.json')
const request = require('request')
const client = new Client({
    user: config.databaseUser,
    host: config.databaseAddress,
    database: config.databaseName,
    password: config.databasePassword,
    port: 5432,
})
module.exports =
class AcceptCommand extends Command {
    constructor (client) {
        super(client, {
            name: 'accept',
            properName: 'Accept',
            description:'Accepts a user\'s appeal',
            userPermissions: [],
            args: [
                {
                    key: 'userid',
                    label: 'userid',
                    prompt: 'What is their user ID?',
                    type: 'string'
                },
                {
                    key: 'note',
                    label: 'note',
                    prompt: 'Leave a note?',
                    type: 'string',
                    default: 'No further information provided by the moderation team.'
                }
            ]
        })
    }
    async fn (msg, args) {
        const appealuser = [args.userid]
        const findappeal = `SELECT * FROM appeals WHERE discord_id = $1;`
        if (msg.member.roles.cache.some(roleslist => config.appealsManagerRole.includes(roleslist))) {
            client.connect()
            client.query(findappeal,appealuser)
            .then(foundinfo => {
                if(foundinfo.rows[0] != null) {
                    const getemailquery = 'SELECT * FROM auth WHERE discord_id = $1;'
                    client.query(getemailquery,appealuser)
                    .then(foundemail => {
                        if (((config.mailgunRegion == 'us') || (config.mailgunRegion == null)) && (config.mailgunApiKey != null)) {
                            request.post({
                                uri: `https://api.mailgun.net/v3/${config.mailgunDomain}/messages`,
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                    'Authorization': `Basic ${config.mailgunApiKey}`
                                },
                                formData: {
                                    'from': config.fromAddress,
                                    'to': foundemail.rows[0].email,
                                    'subject': 'Appeal Accepted',
                                    'html': `<html>Sample text.\n\nNote from the moderation team: ${args.note}</html>`
                                }
                            })
                        }
                        else if ((config.mailgunRegion == 'eu') && (config.mailgunApiKey != null)) {
                            request.post({
                                uri: `https://api.eu.mailgun.net/v3/${config.mailgunDomain}/messages`,
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                    'Authorization': `Basic ${config.mailgunApiKey}`
                                },
                                formData: {
                                    'from': config.fromAddress,
                                    'to': foundemail.rows[0].email,
                                    'subject': 'Appeal Accepted',
                                    'html': `<html>Sample text.\n\nNote from the moderation team: ${args.note}</html>`
                                }
                            })
                        }
                        else {
                            return msg.reply('No Mailgun API key was provided!')
                        }
                    })
                    .catch(e => console.error(e.stack))
                    const markasresolved = 'DELETE FROM appeals WHERE discord_id = $1;'
                    client.query(markasresolved,appealuser)
                    .catch(e => console.error(e.stack))
                    return msg.reply('Appeal accepted and user emailed!')
                }
                else {
                    return msg.reply('There are no unresolved appeals under this user account!')
                }
            })
            .catch(e => console.error(e.stack))
        }
        else {
            return msg.reply('You do not have permission to run this command!')
        }
    }
}
