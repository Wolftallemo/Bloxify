const client = require('../../Database')
const Command = require('../Command')
const config = require('../../data/client.json')
const Discord = require('discord.js')

module.exports =
class FindAppealCommand extends Command {
    constructor (client) {
        super(client, {
            name: 'findappeal',
            properName: 'FindAppeal',
            description: 'Finds the open appeal associated with the given user id (if available)',
            userPermissions: [],
            args: [
                {
                    key: 'userid',
                    label: 'UserID',
                    prompt: 'What is their user ID?',
                    type: 'string'
                }
            ]
        })
    }

    async fn(msg, args) {
        const query = 'SELECT appeals.discord_id, auth.username, auth.discriminator, appeals.reason, appeals.comment, appeals.date FROM appeals,auth where appeals.discord_id = $1 AND auth.discord_id = $1;'
        const val = [args.userid]
        if (msg.member.roles.cache.filter(role => config.appealsManagerRole.includes(role.id))) {
            client.query(query,val)
            .then(found => {
                if (found.rows[0] != null) {
                    const embed = new Discord.MessageEmbed()
                    .setTitle(`Appeal for ${found.rows[0].username}#${('0000'+found.rows[0].discriminator).slice(-4)} (${list.rows[0].discord_id})`)
                    .addFields(
                        {name: 'Reason for ban', value: `${found.rows[0].reason}`},
                        {name: 'Comment', value: `${found.rows[0].comment}`},
                        {name: 'Time', value:`${found.rows[0].date}`}
                    )
                    .setColor(3756250)
                    .setTimestamp()
                    return msg.embed(embed)
                }
                else {
                    return msg.reply('There are no unresolved appeals under this user account!')
                }
            })
            .catch(e => console.error(e.stack))
        }
    }
}