let config = {
    // Server address
    server: 'server.tld',

    // Server port
    port: 6669,

    // Whether to use SSL/TLS (adjust the port accordingly)
    secure: true,

    // Used for nick, name and real name
    name: 'name',

    // The list of channels to join after connecting
    channels: [''],

    // Command prefix
    trigger: '.',

    // NickServ auth password (leave blank to disable)
    nickserv: '',

    // API tokens used for plugins
    tokens: {
        // https://www.wolframalpha.com/
        wolfram: '',

        // https://www.wordnik.com/
        wordnik: '',

        // https://openweathermap.org/
        weather: '',
    }
}

module.exports = config
