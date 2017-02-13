const Plugin = require('../plugin')

class Commands extends Plugin
{
    constructor(bot)
    {
        super({
            name: 'Commands',
            command: 'commands',
        })
    }

    callback(bot, data)
    {
        bot.say(data.to, `Available commands (trigger "${bot.trigger}"): ${bot.get_commands().join(', ')}`)
    }
}

module.exports.Plugin = Commands
