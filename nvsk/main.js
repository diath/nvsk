let main = () => {
    const config = require('./config.js')
    const Bot = require('./bot.js')

    let bot = new Bot(config)
    bot.load()
    bot.run()
}

module.exports = main
