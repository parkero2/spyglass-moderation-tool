const discord = require('discord.js')
const client = new discord.Client()

const config = require('./src/config.json')

client.on('ready', () => {
    client.guilds.cache.get().channels.cache
})

client.login("OTM2NDY0Njg3NjgyNDIwNzY3.YfNktA.dH-UpsEIeQqo4n8xIS2TMkfGzs4")