const Command = require('../Command')
const Discord = require('discord.js')

module.exports =
class AdminRolesCommand extends Command {
    constructor (client) {
        super(client, {
            name: 'adminroles',
            properName: 'AdminRoles',
            description: 'Lists custom admin bypass roles'
        })
    }
    async fn (msg) {
        let rolesText = ''
        if (this.server.getSetting('adminRoles').length > 0) {
            for (var i = 0;i < this.server.getSetting('adminRoles').length;i++) {
                rolesText += `<@&${this.server.getSetting('adminRoles')[i]}>\n`
            }
            const embed = new Discord.MessageEmbed()
            .setTitle('Admin Roles')
            .setDescription(`${rolesText}`)
            .setColor(3756250)
            .setTimestamp()
            return msg.embed(embed)
        }
        else {
            return msg.reply('There are no custom admin roles set for this server!')
        }
    }
}