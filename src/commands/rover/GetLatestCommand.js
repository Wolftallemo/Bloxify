const Command = require('../Command')
const config = require('../../data/client.json')
const { exec } = require("child_process")

module.exports =
class GetLatestCommand extends Command {
    constructor (client) {
        super(client, {
            name: 'getlatest',
            properName: 'GetLatest',
            description: 'Retrieves latest version of code from repo.',
            userPermissions: []
        })
    }
    hasPermission(msg) {
        return msg.member.id === config.owner
    }
    async fn (msg) {
        exec('git pull', async function(error, stdout, stderr) {
            if (error) {
                console.error(error)
                return msg.reply(error)
            }
            await msg.reply(stdout)
            if (stdout.match((/Already up to date\./i))) return
            await msg.channel.send('Restarting...')
            await this.DiscordBot.bot.destroy()
            process.exit()
        })
    }
}