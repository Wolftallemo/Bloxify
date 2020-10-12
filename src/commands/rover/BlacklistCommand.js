const Command = require('../Command')
const config = require('../../data/client.json')
const fs = require('fs')
const request = require('request-promise')

module.exports =
class BlacklistCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'blacklist',
      properName: 'Blacklist',
      description: 'Blacklist a roblox user from the game leaderboard',
      userPermissions: [],
      args: [
        {
          key: 'rbxuser',
          label: 'rbxuser',
          prompt: 'What is their roblox username?',
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
              RBXUSER = JSON.parse(response.body).Username}
            catch (e) {
              return msg.reply(`An error occured! ${e}`)
            }
            const banexists = await request({
              uri: `https://storage.googleapis.com/${config.bucket}/${RBXID}.json`,
              simple: false,
              resolveWithFullResponse: true
            })
            if (RBXID != undefined) {
              if((banexists.statusCode == 404) || (JSON.parse(banexists.body).usercode != '0x2')) {
            fs.writeFileSync(`${config.banFilesPath}/${RBXID}.json`, `{"usercode":"0x1"}`, function (err) {
              if (err) return msg.reply(err)
            })
            const {Storage} = require('@google-cloud/storage')
            const storage = new Storage({keyFilename: config.serviceKeyPath})
            async function uploadFile() {
                await storage.bucket(config.bucket).upload(`${config.banFilesPath}/${RBXID}.json`)
           }
           uploadFile()
           uploadFile().catch(e => {
             return msg.reply(e.response.statusMessage)
           })
           return msg.reply(`${RBXUSER} successfully blacklisted!`)
          }
        else {
          return msg.reply('User is already banned!')
        }}
           else {
             return msg.reply('This user does not exist or already has been banned!')
           }
    }
    else {
      return msg.reply('You do not have your game moderator roles/users added!')
    }
  }
}
