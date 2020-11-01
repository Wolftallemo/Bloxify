const Command = require('../Command')
const Discord = require('discord.js')
const request = require('request-promise')

module.exports =
class DuckCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'duck',
      properName: 'Duck',
      description: 'Shows random duck',
      userPermissions: []
      }
    )
  }

  async fn (msg) {
    let image = 'Unknown'
    let message = 'Unknown'
    try {
      const response = await request({
        uri: `https://random-d.uk/api/random`,
        simple: false,
        resolveWithFullResponse: true
      })
    image = JSON.parse(response.body).url
    message = JSON.parse(response.body).message}
    catch (e) {
      return msg.reply(`An error occured! ${e}`)
    }
    const embed = new Discord.MessageEmbed()
    .setTitle(':duck: QUACK! A random duck for you!')
    .setFooter('Powered by random-d.uk')
    .setImage(`${image}`)
    return msg.embed(embed)
  }
}
