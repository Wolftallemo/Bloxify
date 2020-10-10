const Command = require('../Command')
const client = require('../../Database')
const config = require('../../data/client.json')
const request = require('request')

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
        if ((config.appealsManagerRole != null) && (config.mailgunApiKey != null) && (config.mailgunDomain != null) && (config.fromAddress != null)){
            if (msg.member.roles.cache.filter(role => config.appealsManagerRole.includes(role.id))) {
                client.query(findappeal,appealuser)
                .then(foundinfo => {
                    if(foundinfo.rows[0] != null) {
                        const getemailquery = 'SELECT * FROM auth WHERE discord_id = $1;'
                        client.query(getemailquery,appealuser)
                        .then(foundemail => {
                            if (config.mailgunApiKey != null) {
                                if (config.mailgunRegion != 'eu') {
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
                                    }),function (error,response,body) {
                                        if (error) {
                                            return msg.reply(`Error returned by Mailgun! Error: ${error}`)
                                        }
                                        else if (response.statusCode != ((200) || (204))) {
                                            return msg.reply(`HMMMMMMMMMMM Something fishy happened. Response: ${body}`)
                                        }
                                        else {
                                            return msg.reply('Appeal accepted and user emailed!')
                                        }
                                    }
                                }
                                else {
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
                                    }),function (error,response,body) {
                                        if (error) {
                                            return msg.reply(`Error returned by Mailgun! Error: ${error}`)
                                        }
                                        else if (response.statusCode != ((200) || (204))) {
                                            return msg.reply(`HMMMMMMMMMMM Something fishy happened. Response: ${body}`)
                                        }
                                        else {
                                            return msg.reply('Appeal accepted and user emailed!')
                                        }
                                    }
                                }
                            }
                            else {
                                return msg.reply('Mailgun API key was not set!')
                            }
                        })
                        .catch(e => console.error(e.stack))
                        const markasresolved = 'DELETE FROM appeals WHERE discord_id = $1;'
                        client.query(markasresolved,appealuser)
                        .catch(e => console.error(e.stack))
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
        else {
            return msg.reply('Appeal manager roles were not configured!')
        }
    }
}
