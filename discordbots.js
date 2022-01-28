const discord = require('discord.js');
const cloneClient = new discord.Client();
const SpyClient = new discord.Client();
const fs = require('fs');
const config = require('./config.json');

const data = {};

SpyClient.on('message', async msg => {
    let attachmentsURLS = [];
    let messageEmbeds = [];
    if (Object.keys(data).length >= 50) {
        //Append data the the array then remove the data and index 0; collect data from the end of the array or reverse in the web interface
    }
    let channel = cloneClient.guilds.cache.get(config.clone.cloneID).channels.cache.find(i => i.name == msg.channel.name);
    let catagory = cloneClient.guilds.cache.get(config.clone.cloneID).channels.cache.find(i => i.name == msg.channel.parent.name);
    if (msg.attachments) {
        for (let x of msg.attachments.array()) {
            attachmentsURLS.push(x.url);
            if (x.spoiler) {
                attachmentsURLS.push(" (**TYPE: SPOILER**) ")
            }
            attachmentsURLS.push(" (**TYPE: ATTACHMENT**) \n")
        }
    }
    if (channel) {
        // If Channel Exists, Do This:
        if (msg.channel.nsfw != channel.nsfw) {
            channel.setNSFW(msg.channel.nsfw);
        }
        if (catagory) {
            // If The Channel AND The Catagory Exist, Do This:
            channel.setParent(catagory)
        } else {
            // If the Channel exists but the Catagory does NOT Exist, Do This:
            await cloneClient.guilds.cache.get(config.clone.cloneID).channels.create(msg.channel.parent.name, { type: 'category' }).then(newCat => {
                channel.setParent(newCat)
            })
        }
        if (msg.embeds.length > 0) {
            channel.send(`${msg.author}  (${msg.author.tag}) : ${msg.content}\n${attachmentsURLS.join("") || ""}\n (**TYPE: EMBED**)`);
            for (let x of msg.embeds) {
                channel.send(x);
            }
            return true
        }
        channel.send(`${msg.author}  (${msg.author.tag}) : ${msg.content}\n${attachmentsURLS.join("") || ""}`);
    } else {
        // If Channel Does NOT Exist, Do This:
        if (catagory) {
            // If the Channel Does NOT Exist but the Catagory DOES exist, Do This:
            await cloneClient.guilds.cache.get(config.clone.cloneID).channels.create(msg.channel.name).then(newchan => {
                newchan.setParent(catagory)
                newchan.send(`${msg.author}  (${msg.author.tag}) : ${msg.content}\n${attachmentsURLS.join("") || ""}`)
            })
        } else {
            // If the Channel Does NOT Exist AND the Catagory Does NOT Exist, Do This:
            await cloneClient.guilds.cache.get(config.clone.cloneID).channels.create(msg.channel.name).then(newchan => {
                newchan.send(`${msg.author}  (${msg.author.tag}) : ${msg.content}\n${attachmentsURLS.join("") || ""}`)
                cloneClient.guilds.cache.get(config.clone.cloneID).channels.create(msg.channel.parent.name, { type: 'category' }).then(newCat => {
                    newchan.setParent(newCat);
                })
            })
        }
    }
});

SpyClient.on('voiceStateUpdate', (oldState, newState) => {
    if (config.clone.DATACHANNEL) {
        let channelInfoOld = [];
        let channelInfoNew = [];
        try {
            for (let i of oldState.channel.members.array()) {
                channelInfoOld.push(i.user.tag);
                channelInfoOld.push('\n');
            }
        }catch{}
        try {
            for (let i of newState.channel.members.array()) {
                channelInfoNew.push(i.user.tag);
                channelInfoNew.push('\n');
            }
        }catch{}
        let cName = null;
        try {
            cName = oldState.channel.name;
        }
        catch {
            cName = newState.channel.name;
        }
        if (channelInfoNew.length > channelInfoOld.length) {
            cloneClient.guilds.cache.get(config.clone.cloneID).channels.cache.get(config.clone.DATACHANNEL).send(`**VC UPDATE:**\nChannel name: ${cName}\nServer: ${oldState.guild.name}\n\n**Members in channel**\n${channelInfoNew.join("")}`);
        }
        else {
            cloneClient.guilds.cache.get(config.clone.cloneID).channels.cache.get(config.clone.DATACHANNEL).send(`**VC UPDATE:**\nChannel name: ${cName}\nServer: ${oldState.guild.name}\n\n**Members in channel**\n${channelInfoOld.join("")}`);
        }
    }
});

SpyClient.on('ready', () => {
    console.log(`Logged in as ${SpyClient.user.username}`);
});

cloneClient.on('ready', () => {
    console.log(`Logged in as ${cloneClient.user.username}`);    
});

module.exports = {
    data : {}
}

cloneClient.login(config.clone.clonetoken); //Server you want to forward to
SpyClient.login(config.spy.spytoken); //The server you want to see
