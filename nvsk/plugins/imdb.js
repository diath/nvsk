const Plugin = require('../plugin')
const request = require('request')

class IMDb extends Plugin
{
    constructor(bot)
    {
        super({
            name: 'IMDb',
            command: 'imdb',
            req_params: true,
        })
    }

    callback(bot, data)
    {
        request(`http://omdbapi.com/?t=${data.param}`, (err, response, body) => {
            if (err || response.statusCode != 200) {
                bot.say(data.to, 'Invalid reply from the server.')
            } else {
                let info = JSON.parse(body)
                if (info.error) {
                    bot.say(data.to, info.error)
                } else {
                    bot.say(data.to, `${info.Title} (${info.Year}) (${info.Genre}), more at http://imdb.com/title/${info.imdbID}`)
                }
            }
        })
    }
}

module.exports.Plugin = IMDb
