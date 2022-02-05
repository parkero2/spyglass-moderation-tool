const discord = require('discord.js');
const mockClient = new discord.Client();
const SpyClient = new discord.Client();
const fs = require('fs');
const { Worker } = require('worker_threads'); //Allow threadding, required for voicelogs
const { workerData, parentPort, threadId } = require('worker_threads');
const ffmpeg = require('ffmpeg');

var config = require('./src/config.json');

const data = {};

//I promise to refractor the code soon

//This will manage a thread or something I think. I stole it from stack overflow.
const startVoiceLoggingService = WDat => {
    return new Promise((resolve, reject) => {
        const worker = new Worker('', { WDat });
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', code => code !== 0 && reject(new Error(`Worker stopped with 
        exit code ${code}`)));
    })
}

function voiceLoggingService(voice) {
    parentPort.postMessage(`Started voice logging service in channel ${voice.channel.name}.`)
}

function recordVoice(voice) {
    
}


SpyClient.on('message', async msg => {
    let attachmentsURLS = [];
    if (Object.keys(data).length >= 50) {
        //Append data the the array then remove the data and index 0; collect data from the end of the array or reverse in the web interface
    }
    let channel = mockClient.guilds.cache.get(config.mock.mockID).channels.cache.find(i => i.name == msg.channel.name);
    let catagory = mockClient.guilds.cache.get(config.mock.mockID).channels.cache.find(i => i.name == msg.channel.parent.name);
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
            await mockClient.guilds.cache.get(config.mock.mockID).channels.create(msg.channel.parent.name, { type: 'category' }).then(newCat => {
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
        let memb = new discord.MessageEmbed();
        memb.setAuthor(msg.author.tag, msg.author.avatarURL())
        memb.setFooter(msg.id)
        memb.setTimestamp(new Date())
        mockClient.guilds.cache.get().channels.cache.get().me
        let repliedto = msg.reference.messageID
        let h = mockClient.guilds.cache.get(config.mock.mockID).channels.cache.get(config.mock.IDLogging).fetchMessages()
        console.log(h)
        channel.send(memb).then(mess => {
            mockClient.channels.cache.get(config.mock.IDLogging).send(msg.id+":"+mess.url)
        })
        channel.send(`${msg.author}  (${msg.author.tag}) : ${msg.content}\n${attachmentsURLS.join("") || ""}`);
    } else {
        // If Channel Does NOT Exist, Do This:
        if (catagory) {
            // If the Channel Does NOT Exist but the Catagory DOES exist, Do This:
            await mockClient.guilds.cache.get(config.mock.mockID).channels.create(msg.channel.name).then(newchan => {
                newchan.setParent(catagory)
                newchan.setTopic(msg.channel.topic) //To log the ID of channel in the event of a rename
                newchan.send(`${msg.author}  (${msg.author.tag}) : ${msg.content}\n${attachmentsURLS.join("") || ""}`)
            })
        } else {
            // If the Channel Does NOT Exist AND the Catagory Does NOT Exist, Do This:
            await mockClient.guilds.cache.get(config.mock.mockID).channels.create(msg.channel.name).then(newchan => {
                newchan.send(`${msg.author}  (${msg.author.tag}) : ${msg.content}\n${attachmentsURLS.join("") || ""}`)
                mockClient.guilds.cache.get(config.mock.mockID).channels.create(msg.channel.parent.name, { type: 'category' }).then(newCat => {
                    newchan.setParent(newCat);
                    newchan.setTopic(msg.channel.topic)
                })
            })
        }
    }
});

SpyClient.on('voiceStateUpdate', (oldState, newState) => {
    if (config.mock.DATACHANNEL) {
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
            mockClient.guilds.cache.get(config.mock.mockID).channels.cache.get(config.mock.DATACHANNEL).send(`**VC UPDATE:**\nChannel name: ${cName}\nServer: ${oldState.guild.name}\n\n**Members in channel**\n${channelInfoNew.join("")}`);
        }
        else {
            mockClient.guilds.cache.get(config.mock.mockID).channels.cache.get(config.mock.DATACHANNEL).send(`**VC UPDATE:**\nChannel name: ${cName}\nServer: ${oldState.guild.name}\n\n**Members in channel**\n${channelInfoOld.join("")}`);
        }
    }
    if (config.config.voicelogs && newState.member.id == SpyClient.user.id && SpyClient.guilds.cache.get(config.spy.spyID).me.voice.channel) {
        //Spy client has joined vc and the voicelogging feature is enabled
        recordVoice(SpyClient.guilds.cache.get(config.spy.spyID).me.voice.channel)
    }
});

mockClient.on('message', msg => {
    /**if (msg.content.toUpperCase().startsWith("CONFIG")) {
        console.log(Boolean(msg.content.split(" ")[2]))
        //The config command has been called
        if (msg.member.hasPermission("ADMINISTRATOR") && !msg.author.bot) {
            //Authorise config file updates
            if (config[msg.content.split(" ")[1]] && !msg.content.toUpperCase().includes("TOKEN")) {
                //Check that the value exists and that it does not contain a token
                if (msg.content.split(" ")[1].toUpperCase().startsWith("CONFIG.")) {
                    config["config"][msg.content.split(" ")[1].split(".")[1]] = Boolean(msg.content.split(" ")[2])
                }
                else {
                    config[msg.content.split(" ")[1].split(".")[0]][msg.content.split(" ")[1].split(".")[1]] = msg.content.split(" ")[2]
                }
                fs.writeFile('./backend/src/config.json', JSON.stringify(config, null, 2), function (err) {
                    if (err) {
                        console.log(err)
                        msg.channel.send("Failed to save config file.")
                        return false;
                    }
                    msg.channel.send("Configuration saved. The software may need to be restarted to take effect.")
                    return true;
                });
            }
            else {
                msg.channel.send("The configuration option selected does not exist or you have entered a token. The devs highly recommend deleting the message if you sent a token. Correct formatting is `CONFIG [option] [value]`")
            }
        }
        else {
            msg.channel.send("You need admin permissions in the current guild to complete this command.")
        }
    }*/ //In progress
})

try {
    SpyClient.on('ready', () => {
        console.log(`Logged in as ${SpyClient.user.username}`);
    });
} catch {
    console.log("Spy client failed to login. Please ensure the token is correct in the config.json file. For security reasons, this cannot be edited from Discord.")
    process.exit(0)
}

try {
    mockClient.on('ready', () => {
        console.log(`Logged in as ${mockClient.user.username}`);    
        if(!config.mock.IDLogging) {
            console.log("No ID logging channel found. Creating one.")
            mockClient.guilds.cache.get(config.mock.mockID).channels.create("MessageIDLogs").then(channelCreated => {
                config.mock.IDLogging = channelCreated.id;
                fs.writeFile('./backend/src/config.json', JSON.stringify(config, null, 2), function (err) {
                    if (err) {
                        console.log(err)
                        console.log("Error updating the configuration file.")
                        return false;
                    }
                    console.log("Updated the configuration file.")
                    return true;
                });
            })
        }
    });
}
catch {
    console.log("Mock client failed to login. Please ensure the token is correct in the config.json file. For security reasons, this cannot be edited from Discord.")
    process.exit(0)
}

module.exports = {
    data : {}
}

mockClient.login(config.mock.mocktoken); //Server you want to forward to
SpyClient.login(config.spy.spytoken); //The server you want to see