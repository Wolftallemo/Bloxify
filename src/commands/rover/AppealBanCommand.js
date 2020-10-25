const Command = require('../Command')
const client = require('../../Database')
const config = require('../../data/client.json')

module.exports = 
class AppealBanCommand extends Command {
    constructor (client) {
        super(client, {
            name: 'appealban',
            properName: 'AppealBan',
            description: 'Bans a user from the appeal form',
            userPermissions: [],
            args: [
                {
                    key: 'userid',
                    label: 'UserID',
                    prompt: 'What is their user ID?',
                    type: 'string'
                }
            ]
        })
    }
    hasPermission(msg) {
        return msg.member.roles.cache.some(role => config.appealsManagerRole.includes(role.id))
    }
    async fn (msg, args) {
        const queryval = [args.userid]
        client.query('SELECT * FROM appeals WHERE discord_id = $1;',queryval)
        .then(res => {
            if (res.rows[0]) {
                client.query('UPDATE auth SET blocked = true WHERE discord_id = $1;',queryval)
                .catch(e => {
                    console.error(e)
                    return msg.reply(`An error occured! ${e}`)
                })
            }
        })
        .catch(e => {
            console.error(e)
            return msg.reply(`An error occured! ${e}`)
        })
    }
}