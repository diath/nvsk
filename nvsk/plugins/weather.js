const Plugin = require('../plugin')
const request = require('request')

class Weather extends Plugin
{
    constructor(bot)
    {
        super({
            name: 'Weather',
            command: ['w', 'weather'],
            req_params: true,
        })
    }

    ct(timestamp)
    {
        let date = new Date(timestamp * 1000)
        return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    }

    callback(bot, data)
    {
        request(`http://api.openweathermap.org/data/2.5/weather?q=${data.param}&units=metric&APPID=${bot.config.tokens.weather}`, (err, response, body) => {
            if (err || response.statusCode != 200) {
                bot.say(data.to, 'Invalid reply from the server.')
            } else {
                let info = JSON.parse(body)
                if (info.message) {
                    bot.say(data.to, info.message)
                } else {
                    bot.say(data.to,
                        `${info.name} (${info.sys.country}) (${Math.floor(info.main.temp)}°C) (${info.weather[0].description}, Humidity: ${info.main.humidity}%, Sunrise: ${this.ct(info.sys.sunrise)}, Sunset: ${this.ct(info.sys.sunset)})`
                    )
                }
            }
        })
    }
}

module.exports.Plugin = Weather
