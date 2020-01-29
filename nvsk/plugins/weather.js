const Plugin = require('../plugin')
const request = require('request')

class Weather extends Plugin {
    constructor(bot) {
        super({
            name: 'Weather',
            command: ['w', 'weather'],
            req_params: true,
        })
    }

    ct(timestamp) {
        let date = new Date(timestamp * 1000)
        let hours = date.getHours().toString().padStart(2, '0')
        let minutes = date.getMinutes().toString().padStart(2, '0')
        let seconds = date.getSeconds().toString().padStart(2, '0')
        return `${hours}:${minutes}:${seconds}`
    }

    dir(degrees) {
        let directions = ['North', 'North-East', 'East', 'South-East', 'South', 'South-West', 'West', 'North-West']
        let index = Math.round(degrees / 45)
        return directions[index % directions.length]
    }

    callback(bot, data) {
        request(`http://api.openweathermap.org/data/2.5/weather?q=${data.param}&units=metric&APPID=${bot.config.tokens.weather}`, (err, response, body) => {
            if (err || response.statusCode != 200) {
                bot.say(data.to, 'Invalid reply from the server.')
            } else {
                let info = JSON.parse(body)
                if (info.message) {
                    bot.say(data.to, info.message)
                } else {
                    bot.say(data.to,
                        `${info.name} (${info.sys.country}) (${Math.floor(info.main.temp)}°C) (${info.weather[0].description}, Humidity: ${info.main.humidity}%, Pressure: ${info.main.pressure}hPa, Wind: ${info.wind.speed}m/s ${this.dir(info.wind.deg)}, Sunrise: ${this.ct(info.sys.sunrise)}, Sunset: ${this.ct(info.sys.sunset)})`
                    )
                }
            }
        })
    }
}

module.exports.Plugin = Weather
