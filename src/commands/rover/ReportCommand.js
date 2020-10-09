const Command = require('../Command')
const config = require('../../data/client.json')
const fs = require('fs')
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
      ]}
    )
  }

  async fn (msg, args) {
    const rbxuser = args.rbxuser
    const evidence = args.evidence
    const description = args.description
    let RBXID = 'Unknown'
    let RBXUSER = 'Unknown'
    try {
      const response = await request({
        uri: `https://api.roblox.com/users/get-by-username?username=${rbxuser}`,
        simple: false,
        resolveWithFullResponse: true
      })
      RBXID = JSON.parse(response.body).Id
      RBXUSER = JSON.parse(response.body).Username}
    catch (e) {
      return msg.reply(`An error occured! ${e}`)
    }
    const embed = {
      "embeds": [
        {
          "title": "Exploiter Report",
          "description": `<@${msg.author.id}> has reported ${RBXUSER} for exploiting!\n\nReason: ${description}\n\n[Evidence](${evidence})`,
          "footer": {
            "text": `Reporter ID: ${msg.author.id}`
          }
        }
      ]
    }
    /* Make sure it's a real url */
    if ((RBXID != undefined) && (evidence.match('^(https:\/\/|http:\/\/|<https:\/\/|<http:\/\/.)\S*'))) {
    const discordSend =  await request({uri: config.reportWebhookURL, method:'POST', json: true, body: embed})
    return msg.reply('Report sent!')
    }
    else if (RBXID == undefined) {
      return msg.reply('User does not exist! (If you used a profile link, type their username instead)')
    }
    else {
      return msg.reply('Something went wrong, please make sure the url of your evidence begins with `http://` or `https://`')
    }
  }
}

