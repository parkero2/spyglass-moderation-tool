const discord = require('discord.js');
const mockClient = new discord.Client();
const SpyClient = new discord.Client();
const fs = require('fs');
const config = require('./config.json');

SpyClient.on('message', async msg => {
    if (Object.keys(data).length >= 50) {
        //Append data the the array then remove the data and index 0; collect data from the end of the array or reverse in the web interface
    }
    let channel = mockClient.guilds.cache.get(config.mock.mockID).channels.cache.find(i => i.name == msg.channel.name);
    let catagory = mockClient.guilds.cache.get(config.mock.mockID).channels.cache.find(i => i.name == msg.channel.parent.name);
    if (channel) {
        // If Channel Exists, Do This:
        if (catagory) {
            // If The Channel AND The Catagory Exist, Do This:
            channel.setParent(catagory)
            channel.send(`${msg.author}  (${msg.author.tag}) : ${msg.content}`)
        } else {
            // If the Channel exists but the Catagory does NOT Exist, Do This:
            await mockClient.guilds.cache.get(config.mock.mockID).channels.create(msg.channel.parent.name, { type: 'category' }).then(newCat => {
                channel.setParent(newCat)
                channel.send(`${msg.author}  (${msg.author.tag}) : ${msg.content}`)
            })
        }
    } else {
        // If Channel Does NOT Exist, Do This:
        if (catagory) {
            // If the Channel Does NOT Exist but the Catagory DOES exist, Do This:
            await mockClient.guilds.cache.get(config.mock.mockID).channels.create(msg.channel.name).then(newchan => {
                newchan.setParent(catagory)
                newchan.send(`${msg.author}  (${msg.author.tag}) : ${msg.content}`)
            })
        } else {
            // If the Channel Does NOT Exist AND the Catagory Does NOT Exist, Do This:
            await mockClient.guilds.cache.get(config.mock.mockID).channels.create(msg.channel.name).then(newchan => {
                newchan.send(`${msg.author}  (${msg.author.tag}) : ${msg.content}`)
                mockClient.guilds.cache.get(config.mock.mockID).channels.create(msg.channel.parent.name, { type: 'category' }).then(newCat => {
                    newchan.setParent(newCat);
                })
            })
        }
    }
});

SpyClient.on('voiceStateUpdate', (oldState, newState) => {
    if (config.mock.DATACHANNEL) {
        let oldmem = "empty";
        let newmem = "empty";
        try {
            oldmem = oldState.channel.members.array().forEach(x => x.user.tag);
        }catch{}
        try {
            newmem = newState.channel.members.array().forEach(x => x.user.tag);
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

module.exports = {
    data : {}
}

mockClient.login(config.mock.mocktoken); //Server you want to forward to
SpyClient.login(config.spy.spytoken); //The server you want to see