const Plugin = require('../plugin')

class NickServ extends Plugin
{
    constructor(bot)
    {
        super({
            name: 'NickServ Auth',
        })
    }

    on_ready(bot)
    {
        if (bot.config.nickserv.length != 0) {
            bot.say('nickserv', `IDENTIFY ${bot.config.nickserv}`)
        }
    }
}

module.exports.Plugin = NickServ
