const fs = require('fs')
const irc = require('irc')

const log = (message) => {
    console.log(`* [${new Date().toUTCString()}] ${message}`)
}

class Bot {
    constructor(config) {
        log('Starting up...')

        this.client = new irc.Client(config.server, config.name, {
            port: config.port,
            channels: config.channels,
            secure: config.secure,
            userName: config.name,
            realName: config.name,
            autoConnect: false,
        })

        this.client.addListener('error', this.on_error.bind(this))
        this.client.addListener('registered', this.on_ready.bind(this))
        this.client.addListener('message', this.on_message.bind(this))
        this.client.addListener('join', this.on_join.bind(this))
        this.client.addListener('part', this.on_part.bind(this))
        this.client.addListener('kick', this.on_kick.bind(this))

        this.config = config
        this.plugins = []
        this.trigger = config.trigger
    }

    load() {
        fs.readdirSync('./nvsk/plugins').forEach(name => {
            let plugin = require(`./plugins/${name.slice(0, -3)}`).Plugin
            this.plugins.push(new plugin(this))
        })

        log(`Loaded ${this.plugins.length} plugins...`)
        for (let plugin of this.plugins) {
            log(`\t- ${plugin.name}`)
        }
    }

    run() {
        this.client.connect()
    }

    get_commands() {
        let commands = []
        this.plugins.forEach(plugin => {
            if (plugin.command !== undefined) {
                if (Array.isArray(plugin.command)) {
                    let [head, ...tail] = plugin.command
                    commands.push(`${head} (${tail.join(', ')})`)
                } else {
                    commands.push(plugin.command)
                }
            }
        })

        return commands
    }

    on_error(message) {
        console.error(`Server error: ${message}`)
    }

    on_ready() {
        this.plugins.forEach(plugin => plugin.on_ready(this))
        log('Ready')
    }

    on_message(from, to, message) {
        this.plugins.forEach(plugin => plugin.on_message(this, from, to, message))

        if (to.charAt(0) == '#') {
            log(`[${to}] ${from}: ${message}`)
        } else {
            log(`[Private] ${from}: ${message}`)
        }

        // Commands cannot be triggered by the bot nor via a PM
        if (from == this.client.nick || to == this.client.nick) {
            return
        }

        this.plugins.forEach(plugin => {
            let data = {
                from: from,
                to: to,
                message: message,
            }

            if (plugin.command !== undefined) {
                let commands = (Array.isArray(plugin.command) ? plugin.command : [plugin.command])
                for (let command of commands) {
                    let cmd = `${this.trigger}${command}`
                    if (plugin.req_params) {
                        cmd += ' '
                    }

                    if ((!plugin.req_params && message == cmd) || (plugin.req_params && message.substr(0, cmd.length) == cmd)) {
                        data.command = command

                        if (plugin.req_params) {
                            data.param = message.substr(cmd.length)
                            data.params = message.substr(cmd.length).split(' ')

                            if (!data.param) {
                                break
                            }
                        }

                        plugin.callback(this, data)
                        break
                    }
                }
            }

            if (plugin.pattern !== undefined) {
                let match = message.match(plugin.pattern)
                if (match !== null) {
                    data.pattern = plugin.pattern
                    data.match = match
                    plugin.callback(this, data)
                }
            }
        })
    }

    on_join(channel, name, message) {
        this.plugins.forEach(plugin => plugin.on_join(this, channel, name, message))
        log(`${name} has joined ${channel}.`)
    }

    on_part(channel, name, reason) {
        this.plugins.forEach(plugin => plugin.on_part(this, channel, name, reason))
        log(`${name} has left ${channel} (${reason}).`)
    }

    on_kick(channel, name, by, reason) {
        this.plugins.forEach(plugin => plugin.on_kick(this, channel, name, by, reason))
        log(`${by} has kicked ${name} from ${channel} (${reason}).`)
    }

    say(channel, message) {
        this.client.say(channel, message)
    }
}

module.exports = Bot
