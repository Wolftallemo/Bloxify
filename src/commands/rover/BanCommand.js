const Command = require('../Command')
const config = require('../../data/client.json')
const fs = require('fs')
const request = require('request-promise')
const {Storage} = require('@google-cloud/storage')

module.exports =
class BanCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'ban',
      properName: 'Ban',
      description: 'Ban a roblox user from the game',
      userPermissions: [],
      args: [
        {
          key: 'rbxuser',
          label: 'rbxuser',
          prompt: 'What is their roblox username?',
          type: 'string'
        },
        {
          key: 'reason',
          label: 'reason',
          prompt: 'Please state a reason for the ban',
          type: 'string'
        }
    ]}
  )
}
  hasPermission(msg) {
    return config.gameModeratorUsers.includes(msg.author.id) || msg.members.roles.cache.some(role => config.gameModeratorRole.includes(role.id))
  }
  async fn (msg, args) {
    const rbxuser = args.rbxuser
    const reason = args.reason
    if ((config.gameModeratorRole) || (config.gameModeratorUsers)) {
      let RBXID = 'Unknown'
      let RBXUSER = 'Unknown'
      try {
        const response = await request({
          uri: `https://api.roblox.com/users/get-by-username?username=${rbxuser}`,
          simple: false,
          resolveWithFullResponse: true
        })
        RBXID = JSON.parse(response.body).Id
        RBXUSER = JSON.parse(response.body).Username
      }
      catch (e) {
        return msg.reply(`An error occured! ${e}`)
      }
      if (RBXID != undefined) {
      fs.writeFileSync(`${config.banFilesPath}/${RBXID}.json`, `{"usercode":"0x2","reason":"${reason}"}`, function (err) {
        if (err) return msg.reply(err)
      })
      const storage = new Storage({keyFilename: config.serviceKeyPath})
      async function uploadFile() {
          await storage.bucket(config.bucket).upload(`${config.banFilesPath}/${RBXID}.json`)
      }
      uploadFile()
      uploadFile().catch(e => {
        return msg.reply(e.response.statusMessage)
      })
      return msg.reply(`${RBXUSER} successfully banned!`)
      }
      else {
        return msg.reply('This user does not exist!')
      }
    }
   else {
      return msg.reply('You do not have your game moderator roles/users added!')
    }
  }
}
