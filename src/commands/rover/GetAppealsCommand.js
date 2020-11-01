const client = require('../../Database')
const Command = require('../Command')
const config = require('../../data/client.json')
const Discord = require('discord.js')

module.exports =
class GetAppealsCommand extends Command {
    constructor (client) {
        super(client, {
            name: 'getappeals',
            properName: 'GetAppeals',
            description: 'Returns all open appeals',
            userPermissions: []
        })
    }
    hasPermission(msg){
        return msg.member.roles.cache.some(role => config.appealsManagerRole.includes(role.id))
    }

    async fn(msg) {
        client.query('SELECT appeals.discord_id, auth.username, auth.discriminator FROM appeals,auth WHERE appeals.discord_id = auth.discord_id;')
        .then(list => {
            if (list.rows[0] == null) {
                return msg.reply('No open appeals were found!')
            }
            else {
                var users = ''
                for(var i = 0;i < list.rowCount;i++) {
                    users = `${users}\n\n${list.rows[i].username}#${('0000'+list.rows[i].discriminator).slice(-4)} (${list.rows[i].discord_id})`
                }
                const embed = new Discord.MessageEmbed()
                .setTitle('Open Appeals')
                .setDescription(`${users}`)
                .setColor(3756250)
                .setTimestamp()
                return msg.embed(embed)
            }
        })
        .catch(e => {
            console.error(e.stack)
            return msg.reply(`I could not retrieve the data! ${e}`)
        })
    }
}