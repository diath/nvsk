const Plugin = require('../plugin')
const random = require('random-js')

class Roll extends Plugin
{
    constructor(bot)
    {
        super({
            name: 'Roll',
            command: 'roll',
            req_params: true,
        })

        this.engine = random.engines.mt19937().autoSeed()
    }

    random_number(low, high)
    {
        return random.integer(low, high)(this.engine)
    }

    random_item(array)
    {
        return random.pick(this.engine, array)
    }

    random_dice(count, faces)
    {
        return random.dice(faces, count)(this.engine)
    }

    callback(bot, data)
    {
        if (data.param.indexOf(',') != -1) {
            let choices = data.param.split(',').map(s => s.trim())
            if (choices.length) {
                bot.say(data.to, this.random_item(choices))
            }
        } else if (data.param.indexOf('-') != -1) {
            let args = data.param.split('-')
            if (args.length == 2) {
                let x = parseInt(args[0], 10)
                let y = parseInt(args[1], 10)

                if (x !== NaN && y != NaN) {
                    bot.say(data.to, `${this.random_number(x, y)}`)
                }
            }
        } else {
            let result = data.param.match(/(\d+)d(\d+)/)
            if (result) {
                let count = parseInt(result[1])
                let faces = parseInt(result[2])

                if (count !== NaN && faces !== NaN) {
                    if (count > 10 || faces > 36) {
                        bot.say(data.to, 'You can only roll up to 10 dice with up to 36 faces.')
                    } else {
                        let total = this.random_dice(count, faces)
                        bot.say(data.to, `${total.join(', ')} (${total.reduce((x, y) => x + y)} total)`)
                    }
                }
            }
        }
    }
}

module.exports.Plugin = Roll
