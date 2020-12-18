const Command = require('../Command')
const config = require('../../data/client.json')
const request = require('request-promise')

module.exports =
class ReportCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'report',
      properName: 'Report',
      description: 'Report a player for exploiting',
      userPermissions: [],
      args: [
        {
          key: 'rbxuser',
          label: 'RobloxUsername',
          prompt: 'What is their Roblox Username?',
          type: 'string'
        },
        {
          key: 'evidence',
          label: 'EvidenceURL',
          prompt: 'Please specify the URL of your evidence, if you cannot sign up/sign in to a service, <https://streamable.com> is a good option',
          type: 'string'
        },
        {
          key: 'description',
          label: 'Description',
          prompt: 'Please provide a description of what the exploiter is doing',
          type: 'string'
        }
      ]
    }
    )
  }

  async fn (msg, args) {
    let rbxuser = args.rbxuser
    let evidence = args.evidence
    const description = args.description
    let RBXID = 'Unknown'
    let RBXUSER = 'Unknown'
    if (description.match(/(https?:\/\/)(www\.|web\.)?(roblox\.com)/g) || evidence.match(/(https?:\/\/)(www\.|web\.)?(roblox\.com)/g)) return msg.reply('Roblox links are not acceptable evidence!')
    if (rbxuser.match(/(<|>)/g)) rbxuser = rbxuser.replace(/(<|>)/g, '')
    if (evidence.match(/(<|>)/g)) evidence = evidence.replace(/(<|>)/g, '')
    try {
      const response = await request({
        uri: `https://api.roblox.com/users/get-by-username?username=${rbxuser}`,
        simple: false,
        resolveWithFullResponse: true
      })
      RBXID = JSON.parse(response.body).Id
      RBXUSER = JSON.parse(response.body).Username
    } catch (e) {
      return msg.reply(`An error occured! ${e}`)
    }
    const embed = {
      embeds: [
        {
          title: 'Exploiter Report',
          description: `<@${msg.author.id}> has reported ${RBXUSER} for exploiting!\n\nReason: ${description}\n\n[Evidence](${evidence})`,
          footer: {
            text: `Reporter: ${msg.author.tag} - ${msg.author.id}`
          }
        }
      ]
    }
    if (RBXID) {
      let validurl = true
      try {
        await request({ uri: evidence, options: { simple: false, resolveWithFullResponse: true } })
      } catch {
        validurl = false
      }
      if (!validurl) return msg.reply('Something went wrong, please make sure the url you provided is valid (it must contain `http://` or `https://`).')
      await request({ uri: config.reportWebhookURL, method: 'POST', json: true, body: embed })
      return msg.reply('Report sent!')
    } else {
      return msg.reply('User does not exist! (If you used a profile link, type their username instead)')
    }
  }
}
