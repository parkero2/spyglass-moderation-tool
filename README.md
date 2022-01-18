# spyglass
[![FullSystemTest](https://github.com/parkero2/spyglass/actions/workflows/fullTest.yml/badge.svg?branch=main)](https://github.com/parkero2/spyglass/actions/workflows/fullTest.yml) 
This is no longer relivant as the tokens have been changed

# Info
Spyglass can serve a large range of pourposes. But officially, it is a **MODERATION TOOL**. The whole thing relies on atleast one bot. When a message or voice channel event is recieved by the 'spy client' (the monitoring bot), the event will be replicated in the output server.

### Messages
![image](https://user-images.githubusercontent.com/72895391/149746342-4c1c95ca-72c9-4490-8a83-7343019abba7.png) ![image](https://user-images.githubusercontent.com/72895391/149746499-4b4c5a5f-02d6-4ec8-9ed8-071739f95f47.png)

### Voice channels
![image](https://user-images.githubusercontent.com/72895391/149746663-9ea6f511-5941-495c-b075-8c0dab9bb9fb.png)![image](https://user-images.githubusercontent.com/72895391/149746700-686bde3b-9e6b-4ebb-a030-31328f8891b5.png)

# Disclaimer
Niether myself nor any of the contributors are responsible for any negative reprecussions as a result of the use of this software.

# Usage

You will need:
- [nodeJS](https://nodejs.org/)
- [A Discord bot token](https://discord.com/developers/applications)

## Setup
1) Clone the repository or download the ZIP file and extract the contents.
2) Open a command window/terminal from within the unzipped directory and run `npm i` to install the dependancies.
3) Open the [config.json](/config.json) and enter your spy bot token (the monitoring bot token) and the mock client token (the delivery bot token - can be the same as the spy client)
4) Assign server IDs to the `spyID` and `mockID` values in [config.json](/config.json). These should reflect the servers that your bot(s) are monitoring and logging.
5) Add a logging channel for the mock client (delivery bot) to log voice channel interactions.
6) In your command/terminal window, run `node .` to begin running the bot

A huge thanks to [@GalaxyFlight](https://github.com/galaxyflight) for helping out with this. 

If you find a bug, feel free to report it in the [issues](https://github.com/parkero2/spyglass/issues) tab.
[Discord](https://discord.gg/BTJ5KQstTJ)
