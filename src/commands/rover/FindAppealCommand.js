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
    hasPermission(msg){
        return msg.member.roles.cache.some(role => config.appealsManagerRole.includes(role.id))
    }
    async fn(msg, args) {
        const query = 'SELECT appeals.discord_id, auth.username, auth.discriminator, appeals.reason, appeals.comment, appeals.date FROM appeals,auth where appeals.discord_id = $1 AND auth.discord_id = $1;'
        const val = [args.userid]
        client.query(query,val)
        .then(found => {
            if (found.rows[0]) {
                function checkReason () {
                    if (!found.rows[0].reason) {
                        return reason = "No reason provided"
                    }
                    return reason = found.rows[0].reason
                }
                const reason = checkReason()
                function checkComment () {
                    if (!found.rows[0].comment) {
                        return comment = "No comment provided"
                    }
                    return comment = found.rows[0].comment
                }
                const comment = checkComment()
                const embed = new Discord.MessageEmbed()
                .setTitle(`Appeal for ${found.rows[0].username}#${('0000'+found.rows[0].discriminator).slice(-4)} (${found.rows[0].discord_id})`)
                .addFields(
                    {name: 'Reason for ban', value: `${reason}`},
                    {name: 'Comment', value: `${comment}`},
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
