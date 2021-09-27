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

SpyClient.on('voiceStateUpdate', (oldState, newState) => {
    if (config.mock.DATACHANNEL) {
        let oldmem = "empty";
        let newmem = "empty";
        try {
            oldmem = oldState.channel.members.array();
        }catch{}
        try {
            newmem = newState.channel.members.array();
        }catch{}
        mockClient.guilds.cache.get(config.mock.mockID).channels.cache.get(config.mock.DATACHANNEL).send(`**VC UPDATE:**\n\n>OLD STATE\n${oldmem}\n>NEW STATE\n${newmem}`)
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