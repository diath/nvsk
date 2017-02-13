class Plugin
{
    constructor(data)
    {
        this.name = data.name
        this.command = data.command
        this.pattern = data.pattern
        this.req_params = data.req_params
    }

    callback(bot, data)
    {
    }

    on_ready(bot)
    {
    }

    on_message(bot, from, to, message)
    {
    }

    on_join(bot, channel, name, message)
    {
    }

    on_part(bot, channel, name, reason)
    {
    }

    on_kick(bot, channel, name, by, reason)
    {
    }
}

module.exports = Plugin
