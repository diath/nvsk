const Plugin = require('../plugin')

class Calculator extends Plugin {
    constructor(bot) {
        super({
            name: 'Calculator',
            command: 'calc',
            req_params: true,
        })

        this.client = require('wolfram-alpha').createClient(bot.config.tokens.wolfram)
    }

    get_wa_result(data) {
        for (let block of data) {
            if (block.title == 'Result') {
                return block.subpods[0].text
            }
        }

        return null
    }

    callback(bot, data) {
        this.client.query(data.param, (err, result) => {
            if (err) {
                bot.say(data.to, `Calculator error: ${err}`)
            } else {
                let wa_result = this.get_wa_result(result)
                if (!wa_result) {
                    bot.say(data.to, 'No results found')
                } else {
                    bot.say(data.to, wa_result)
                }
            }
        })
    }
}

module.exports.Plugin = Calculator
