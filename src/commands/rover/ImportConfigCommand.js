const Command = require('../Command')

module.exports =
class ImportConfigCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'importconfig',
      properName: 'ImportConfig',
      aliases: ['importsettings'],
      description: 'Imports an attached configuration file',
      throttling: { usages: 1, duration: 180 }
    })
  }

  async fn (msg) {
    if (this.server.ongoingSettingsUpdate) return msg.reply('Server settings are currently being saved - please try again in a few moments.')
    if (msg.attachments.size === 0) return msg.reply('No attachments were found!')
    let confIn
    msg.attachments.forEach(att => { if (att.url.endsWith('.json') && !confIn) confIn = att.url })
    if (!confIn) return msg.reply('Could not find the configuration file - please try again.')
    const request = require('request-promise')
    const data = await request(confIn, { json: true }).catch(() => {})
    if (!data) return msg.reply('An error occured while downloading your configuration file - please try again.')
    const { sleep } = require('../../Util')
    // sleep until there is no longer an ongoing settings update to make sure that all settings are correctly saved
    if ((data.verifiedRole || data.verifiedRole === null) && data.verifiedRole !== this.server.getSetting('verifiedRole') && msg.guild.roles.cache.find(role => role.id === data.verifiedRole)) this.server.setSetting('verifiedRole', data.verifiedRole)
    while (this.server.ongoingSettingsUpdate) await sleep(5)
    if ((data.verifiedRemovedRole || data.verifiedRemovedRole === null) && data.verifiedRemovedRole !== this.server.getSetting('verifiedRemovedRole') && msg.guild.roles.cache.find(role => role.id === data.verifiedRemovedRole)) this.server.setSetting('verifiedRemovedRole', data.verifiedRemovedRole)
    while (this.server.ongoingSettingsUpdate) await sleep(5)
    if ([true, false].includes(data.nicknameUsers)) this.server.setSetting('nicknameUsers', data.nicknameUsers)
    while (this.server.ongoingSettingsUpdate) await sleep(5)
    if ((data.nicknameGroup || data.nicknameGroup === null)) this.server.setSetting('nicknameGroup', data.nicknameGroup)
    while (this.server.ongoingSettingsUpdate) await sleep(5)
    if ([true, false].includes(data.joinDM)) this.server.setSetting('joinDM', data.joinDM)
    while (this.server.ongoingSettingsUpdate) await sleep(5)
    if ((data.verifyChannel || data.verifyChannel === null) && data.verifyChannel !== this.server.getSetting('verifyChannel') && msg.guild.channels.cache.find(c => c.id === data.verifyChannel)) this.server.setSetting('verifyChannel', data.verifyChannel)
    while (this.server.ongoingSettingsUpdate) await sleep(5)
    if ((data.announceChannel || data.announceChannel === null) && data.announceChannel !== this.server.getSetting('announceChannel') && msg.guild.channels.cache.find(c => c.id === data.announceChannel)) this.server.setSetting('announceChannel', data.announceChannel)
    while (this.server.ongoingSettingsUpdate) await sleep(5)
    if (data.nicknameFormat && data.nicknameFormat !== 'undefined') this.server.setSetting('nicknameFormat', data.nicknameFormat)
    else this.server.setSetting('nicknameFormat', '%USERNAME%')
    while (this.server.ongoingSettingsUpdate) await sleep(5)
    if (data.welcomeMessage && data.welcomeMessage !== 'undefined') this.server.setSetting('welcomeMessage', data.welcomeMessage)
    else this.server.setSetting('welcomeMessage', 'Welcome to %SERVER%, %USERNAME%!')
    while (this.server.ongoingSettingsUpdate) await sleep(5)
    if (Array.isArray(data.groupRankBindings) && data.groupRankBindings.length > 0 && data.groupRankBindings.every(bind => {
      (bind.role && Array.isArray(bind.groups))
    })) return msg.reply('Configuration file imported!')
  }
}
