const Command = require('../Command')

module.exports =
class SupportServerCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'support',
      properName: 'Support',
      aliases: ['server'],
      userPermissions: [],
      description: 'Displays contact information of bot developer'
    })
  }

  async fn (msg) {
    msg.author.send('Having trouble? DM Wolftallemo#0666, or you can check out the documentation here: https://rover.link/#readme').then(() => {
      msg.reply('Sent you a DM with information.')
    }).catch(() => {
      msg.reply('I can\'t seem to message you - please make sure your DMs are enabled!')
    })
  }
}
