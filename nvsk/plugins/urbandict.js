const Plugin = require('../plugin')
const request = require('request')

class UrbanDictionary extends Plugin
{
    constructor(bot)
    {
        super({
            name: 'Urban Dictionary',
            command: 'ud',
            req_params: true,
        })
    }

    callback(bot, data)
    {
        request(`http://api.urbandictionary.com/v0/define?page=0&term=${data.param}`, (err, response, body) => {
            if (err || response.statusCode != 200) {
            } else {
                let info = JSON.parse(body)
                if (!info.list || info.list.length == 0) {
                    bot.say(data.to, 'No definitions found.')
                } else {
                    bot.say(data.to, `Definitions for "${data.param}":\n- ${info.list.slice(0, 3).map(v => v.definition).join('\n- ')}`)
                }
            }
        })
    }
}

module.exports.Plugin = UrbanDictionary
