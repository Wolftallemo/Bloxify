const Command = require('../Command')
const config = require('../../data/client.json')

module.exports =
class RestartCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'restart',
      properName: 'Restart',
      description: 'Restarts the bot process',
      userPermissions: []
    })
  }

  hasPermission (msg) {
    return msg.member.id === config.owner
  }

  async fn (msg) {
    await msg.channel.send('Restarting...')
    process.exit()
  }
}
