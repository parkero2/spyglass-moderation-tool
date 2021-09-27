const discord = require('discord.js');
const mockClient = new discord.Client();
const SpyClient = new discord.Client();
const fs = require('fs');
const config = require('./config.json');

SpyClient.on('message', async msg => {
    let chan = mockClient.guilds.cache.get(config.mock.mockID).channels.cache.find(i => i.name == msg.channel.name);
    if (chan) {
        chan.send(`${msg.author.tag} (${msg.member.displayName}) : ${msg.content}`);
    }
    else {
        await mockClient.guilds.cache.get(config.mock.mockID).channels.create(msg.channel.name).then(cah => {
            cah.send(`${msg.author.tag} (${msg.member.displayName}) : ${msg.content}`);
        })
    }
});

SpyClient.on('ready', () => {
    console.log(`Logged in as ${SpyClient.user.username}`);
});

mockClient.on('ready', () => {
    console.log(`Logged in as ${mockClient.user.username}`);
});

mockClient.login(config.mock.mocktoken); //Server you want to forward to
SpyClient.login(config.spy.spytoken); //The server you want to see