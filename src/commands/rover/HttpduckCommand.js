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
    let codesarray = 'unknown'
    try {
      const response = await request({
        uri: 'https://random-d.uk/api/list',
        simple: false
      })
      console.log(JSON.parse(response).http.toString())
      codesarray = JSON.parse(response).http
      codes = codesarray.toString()
      const regex = `/(${args.httpstatus}.)\w*/`
      if (codes.match(regex)) {
        const embed = new Discord.MessageEmbed()
        .setFooter('Powered by random-d.uk')
        .setImage(`https://random-d.uk/api/http/${args.httpstatus}`)
        return msg.embed(embed)
      }
      else {
        return msg.reply('We do not have a duck with that status code yet!')
      }
    }
    catch(e) {
      return msg.reply(`An error occured! ${e}`)
    }
  }
}
