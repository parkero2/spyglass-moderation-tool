const discord = require('discord.js');
const mockClient = new discord.Client();
const SpyClient = new discord.Client();
const fs = require('fs');
const config = require('./config.json');


SpyClient.on('message', async msg => {
    let channel = mockClient.guilds.cache.get(config.mock.mockID).channels.cache.find(i => i.name == msg.channel.name);
    let catagory = mockClient.guilds.cache.get(config.mock.mockID).channels.cache.find(i => i.name == msg.channel.parent.name);
    if (channel) {
        // If Channel Exists, Do This:
        if (catagory) {
            // If The Channel AND The Catagory Exist, Do This:
            channel.setParent(catagory)
            channel.send("<@" + msg.author.id + ">" + ":" + msg.content)
        } else {
            // If the Channel exists but the Catagory does NOT Exist, Do This:
            await mockClient.guilds.cache.get(config.mock.mockID).channels.create(msg.channel.parent.name, { type: 'category' }).then(NewCatagory => {
                channel.setParent(NewCatagory)
                channel.send("<@" + msg.author.id + ">" + ":" + msg.content)
            })
        }
    } else {
        // If Channel Does NOT Exist, Do This:
        if (catagory) {
            // If the Channel Does NOT Exist but the Catagory DOES exist, Do This:
            await mockClient.guilds.cache.get(config.mock.mockID).channels.create(msg.channel.name).then(NewChannel => {
                NewChannel.setParent(catagory)
                NewChannel.send("<@" + msg.author.id + ">" + ":" + msg.content)
            })
        } else {
            // If the Channel Does NOT Exist AND the Catagory Does NOT Exist, Do This:
            await mockClient.guilds.cache.get(config.mock.mockID).channels.create(msg.channel.name).then(NewChannel => {
                NewChannel.send("<@" + msg.author.id + ">" + ":" + msg.content)
                mockClient.guilds.cache.get(config.mock.mockID).channels.create(msg.channel.parent.name, { type: 'category' }).then(NewCatagory => {
                    NewChannel.setParent(NewCatagory);
                })
            })
        }
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