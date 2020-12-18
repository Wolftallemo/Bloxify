const Command = require('../Command')
const client = require('../../Database')
const config = require('../../data/client.json')
const request = require('request')

module.exports =
class ForceEmailCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'forceemail',
      properName: 'ForceEmail',
      description: 'Will email any user who has ever signed in on the appeal form, regardless of if they have an open appeal.',
      userPermissions: [],
      args: [
        {
          key: 'userid',
          label: 'UserID',
          prompt: 'What is their user ID?',
          type: 'string'
        },
        {
          key: 'message',
          label: 'Message',
          prompt: 'Message to send?',
          type: 'string'
        }
      ]
    })
  }

  hasPermission (msg) {
    return msg.member.roles.cache.some(role => config.appealsManagerRole.includes(role.id))
  }

  async fn (msg, args) {
    if ((config.appealsManagerRole != null) && (config.mailgunApiKey != null) && (config.mailgunDomain != null) && (config.fromAddress != null)) {
      const query = 'SELECT * FROM auth WHERE discord_id = $1;'
      const val = [args.userid]
      client.query(query, val)
        .then(res => {
          if (res.rows[0] != null) {
            const email = {
              from: config.fromAddress,
              to: res.rows[0].email,
              subject: 'Message from the Car Crushers Moderation Team',
              html: `<html>${args.message}<br/><br/>This email was sent from an address that cannot receive</html>`
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
                  return msg.reply('Message sent!')
                } else {
                  return msg.reply(`Mailgun returned an error! (${error})`)
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
                  return msg.reply('Message sent!')
                } else {
                  console.error(error)
                  return msg.reply(`Mailgun returned an error! (HTTP ${response.statusCode}: ${response.statusMessage})`)
                }
              })
            }
          } else {
            return msg.reply('We do not have an email address for this user!')
          }
        })
        .catch(e => {
          console.error(e.stack)
          return msg.reply(`Something br0ke! ${e}`)
        })
    } else {
      return msg.reply('Mailgun settings and/or appeals manager roles are missing!')
    }
  }
}
