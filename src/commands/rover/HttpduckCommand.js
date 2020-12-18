const Command = require('../Command')
const Discord = require('discord.js')
const request = require('request-promise')

module.exports =
class HttpduckCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'httpduck',
      properName: 'HttpDuck',
      description: 'Shows an http status duck',
      userPermissions: [],
      args: [
        {
          key: 'httpstatus',
          label: 'HttpStatus',
          prompt: 'Status code?',
          type: 'integer'
        }
      ]
    }
    )
  }

  async fn (msg, args) {
    try {
      const response = await request({
        uri: 'https://random-d.uk/api/list',
        simple: false
      })
      const code = JSON.parse(response).http.toString().match(args.httpstatus)
      if (code) {
        const embed = new Discord.MessageEmbed()
          .setFooter('Powered by random-d.uk')
          .setImage(`https://random-d.uk/api/http/${code}`)
        return msg.embed(embed)
      } else {
        return msg.reply('We do not have a duck with that status code yet!')
      }
    } catch (e) {
      return msg.reply(`An error occured! ${e}`)
    }
  }
}
