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
        try {
            const queryval = [args.userid]
            const user = await client.query('SELECT * FROM auth WHERE discord_id = $1;',queryval)
            if (!app.rows[0]) return msg.reply('This user is not in the database!')
            await client.query('UPDATE auth SET blocked = true WHERE discord_id = $1;',queryval)
            return msg.reply('User has been banned from the form!')
        }
        catch (e) {
            console.error(e)
            return msg.reply(e)
        }
    }
}
