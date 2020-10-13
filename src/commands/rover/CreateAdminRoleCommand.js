const Command = require('../Command')

module.exports =
class CreateAdminRoleCommand extends Command {
    constructor (client) {
        super(client, {
            name: 'createadminrole',
            properName: 'CreateAdminRole',
            aliases: ['virgilcreateadminrole','addadminrole'],
            description: 'Creates custom admin role (and the role if necessary).',
            args: [
                {
                    key: 'role',
                    label: 'role',
                    prompt: 'Role?',
                    type: 'role'
                }
            ]
        })
    }
    async fn (msg, args) {
        if (!msg.guild.me.hasPermission('MANAGE_ROLES')) {
            return msg.reply("Virgil needs the 'Manage Roles' permission in order to do this.")
        }
        if (this.server.ongoingSettingsUpdate) return msg.reply('Server settings are currently being saved - please try again in a few moments.')
        if (args.role.name === '@everyone' || args.role.name === '@here') return msg.reply('You are unable to bind this role.')
        if (this.server.getSetting('adminRoles').includes(args.role.id)) return msg.reply('This role is already designated as an admin role.')
        const adminRoles = this.server.getSetting('adminRoles')
        adminRoles.push(args.role.id)
        this.server.setSetting('adminRoles', adminRoles)
        return msg.reply(`${args.role.name} added as an admin role!`)
    }
}