const Plugin = require('../plugin')
const request = require('request')

class Wordnik extends Plugin
{
    constructor(bot)
    {
        super({
            name: 'Wordnik',
            command: 'define',
            req_params: true,
        })
    }

    callback(bot, data)
    {
        request(`http://api.wordnik.com/v4/word.json/${data.param}/definitions?api_key=${bot.config.tokens.wordnik}&limit=3`, (err, response, body) => {
            if (err || response.statusCode != 200) {
                bot.say(data.to, 'Invalid reply from the server.')
            } else {
                let info = JSON.parse(body)
                if (info.length == 0) {
                    bot.say(data.to, `No definitions for "${data.param}".`)
                } else {
                    bot.say(data.to, `Definitions for "${data.param}:\n- ${info.slice(0, 3).map(v => v.text).join('\n- ')}`)
                }
            }
        })
    }
}

module.exports.Plugin = Wordnik
