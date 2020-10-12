const Command = require('../Command')

module.exports =
class HelpCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'roverhelp',
      properName: 'RoVer',
      aliases: ['rover'],
      description: 'Displays a description of RoVer'
    })
  }

  async fn (msg) {
    const output = `Welcome to Virgil, a customized bot based on RoVer customized for Car Crushers!. If you need help, you can find contact information by using the \`${msg.guild.commandPrefix}support\` command. You can run \`${msg.guild.commandPrefix}help\` to see a list of commands. For instructions, please see the README at https://github.com/Wolftallemo/Virgil/blob/master/README.md.`

    msg.reply(output)
  }
}
