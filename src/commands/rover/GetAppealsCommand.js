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

    async fn(msg) {
        if (msg.member.roles.cache.filter(role => config.appealsManagerRole.includes(role.id))) {
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
                    return msg.embed(embed)
                }
            })
            .catch(e => console.error(e.stack))
        }
        else {
            return msg.reply('You do not have permission to run this command!')
        }
    }
}