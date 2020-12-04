const Command = require('../Command')
const config = require('../../data/client.json')

module.exports =
class ExitCommand extends Command {
    constructor (client) {
        super(client, {
            name: 'exit',
            properName: 'Exit',
            description: 'Ends the bot process',
            userPermissions: []
        })
    }
    hasPermission(msg) {
        return msg.member.id === config.owner
    }
    async fn (msg) {
        await msg.channel.send('Goodbye...')
        process.exit()
    }
}