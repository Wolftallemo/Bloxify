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
    let reason = args.reason
    if (reason.match(/(["])/g)) reason = reason.replace(/(["])/g,'\"')
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
      if (!RBXID) return msg.reply('Either this user was terminated or Roblox is having problems!')
      fs.writeFile(`./${RBXID}.json`,`{"usercode":"0x2","reason":"${reason}"}`,function (err) {
        if (err) {
          console.error(err)
          return msg.reply(err)
        }
      })
      const storage = new Storage({keyFilename: config.serviceKeyPath})
      try {
        await storage.bucket(config.bucket).upload(`./${RBXID}.json`).catch(e => {
          console.error(e)
          return msg.reply(e)
        })
        const fileCheck = await request(`https://storage.googleapis.com/${config.bucket}/${RBXID}.json`,{resolveWithFullResponse: true})
        if (fileCheck.statusCode == 403) await storage.bucket(config.bucket).file(`${RBXID}.json`).makePublic().catch(e => {
          console.error(e)
          return msg.reply(e)
        })
      }
      catch (e) {
        console.error(e)
        return msg.reply(e)
      }
      await msg.reply(`${RBXUSER} successfully banned!`)
      fs.unlink(`./${RBXID}.json`, function (err) {
        if (err) console.error(err)
      })
    }
    else {
      return msg.reply('You do not have your game moderator roles/users added!')
    }
  }
}
