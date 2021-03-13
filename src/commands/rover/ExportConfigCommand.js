const Command = require('../Command')

module.exports =
class ExportConfigCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'exportconfig',
      properName: 'ExportConfig',
      aliases: ['exportsettings'],
      description: ''
    })
  }

  async fn (msg) {
    const { join } = require('path')
    await msg.reply('Here is the server\'s configuration file.', {
      files: [{
        attachment: join(__dirname, `../../data/${msg.guild.id}.json`),
        name: `${msg.guild.id}.json`
      }]
    })
  }
}
