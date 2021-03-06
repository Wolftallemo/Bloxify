const Command = require('../Command')
const client = require('../../Database')
const config = require('../../data/client.json')
const request = require('request')

module.exports =
class AcceptCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'accept',
      properName: 'Accept',
      description: 'Accepts a user\'s appeal',
      userPermissions: [],
      args: [
        {
          key: 'userid',
          label: 'UserID',
          prompt: 'What is their user ID?',
          type: 'string'
        },
        {
          key: 'note',
          label: 'Note',
          prompt: 'Leave a note?',
          type: 'string',
          default: 'No further information provided by the moderation team.'
        }
      ]
    })
  }

  hasPermission (msg) {
    return msg.member.roles.cache.some(role => config.appealsManagerRole.includes(role.id))
  }

  async fn (msg, args) {
    const appealuser = [args.userid]
    const findappeal = 'SELECT * FROM appeals WHERE discord_id = $1;'
    if ((config.appealsManagerRole) && (config.mailgunApiKey) && (config.mailgunDomain) && (config.fromAddress)) {
      client.query(findappeal, appealuser)
        .then(foundinfo => {
          if (foundinfo.rows[0] != null) {
            const getemailquery = 'SELECT * FROM auth WHERE discord_id = $1;'
            client.query(getemailquery, appealuser)
              .then(foundemail => {
                const email = {
                  from: config.fromAddress,
                  to: foundemail.rows[0].email,
                  subject: 'Appeal Accepted',
                  html: `<html>Your appeal was accepted, you may join us again at our <a href="${config.appealsInvite}" target="_blank">discord server</a>.<br/><br/>Note from the moderation team: ${args.note}</html>`
                }
                const mailgunApiKey = Buffer.from(`api:${config.mailgunApiKey}`, 'utf8')
                const base64MailgunApiKey = mailgunApiKey.toString('base64')
                if (config.mailgunRegion !== 'eu') {
                  request.post({
                    uri: `https://api.mailgun.net/v3/${config.mailgunDomain}/messages`,
                    headers: {
                      'Content-Type': 'multipart/form-data',
                      Authorization: `Basic ${base64MailgunApiKey}`
                    },
                    formData: email
                  }, function (error, response, body) {
                    if (response.statusCode === 200) {
                      msg.guild.members.unban(args.userid).catch()
                      return msg.reply('Appeal accepted and user emailed!')
                    } else {
                      console.error(error)
                      return msg.reply(`Mailgun returned an error! (HTTP ${response.statusCode}: ${response.statusMessage})`)
                    }
                  })
                } else {
                  request.post({
                    uri: `https://api.eu.mailgun.net/v3/${config.mailgunDomain}/messages`,
                    headers: {
                      'Content-Type': 'multipart/form-data',
                      Authorization: `Basic ${base64MailgunApiKey}`
                    },
                    formData: email
                  }, function (error, response, body) {
                    if (response.statusCode === 200) {
                      msg.guild.members.unban(args.userid).catch()
                      return msg.reply('Appeal accepted and user emailed!')
                    } else {
                      console.error(error)
                      return msg.reply(`Mailgun returned an error! (HTTP ${response.statusCode}: ${response.statusMessage})`)
                    }
                  })
                }
              })
              .catch(e => {
                console.error(e.stack)
                return msg.reply(`I could not retrieve the data! ${e}`)
              })
            const markasresolved = 'DELETE FROM appeals WHERE discord_id = $1;'
            client.query(markasresolved, appealuser)
              .catch(e => {
                console.error(e.stack)
                return msg.reply('I could not resolve this appeal!')
              })
          } else {
            return msg.reply('There are no unresolved appeals under this user account!')
          }
        })
        .catch(e => {
          console.error(e.stack)
          return msg.reply(`I could not retrieve the data! ${e}`)
        })
    } else {
      return msg.reply('Make sure your appeal manager roles and mailgun information are set!')
    }
  }
}
