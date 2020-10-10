<p align="center">
    <a href="https://eryn.io/RoVer/"><img src="/assets/Logo_Text.svg" alt="RoVer" height="150" /></a>
</p>

<p align="center">
    <a href="https://discordapp.com/oauth2/authorize?client_id=298796807323123712&scope=bot&permissions=402656264"><img src="/assets/Add_RoVer.png" alt="Add" /></a>
</p>

<p align="center">
  <a href="https://www.patreon.com/erynlynn"><img src="http://i.imgur.com/dujYlAK.png" alt="Patreon"></a>
  <a href="https://standardjs.com"><img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" alt="JavaScript Style Guide"></a>
  <a href="https://eryn.io/RoVer"><img src="https://img.shields.io/badge/verified%20users-3.2M%2B-brightgreen.svg" alt="Verified Users"></a>
  <a href="https://eryn.io/RoVer"><img src="https://img.shields.io/badge/total%20servers-101K%2B-brightgreen.svg" alt="Discord Servers"></a>
  <br>
  <a href="https://discord.gg/7yfwrat"><img src="https://img.shields.io/discord/425800792679645204.svg" alt="Discord"></a>
</p>

<h1 align="center"><a href="https://rover.link/#readme">Documentation can be found on the RoVer website</a></h1>

## Self-hosting instructions
Self-hosting is recommended for advanced users only who are experienced with the Node.js ecosystem. Note that setup or code support will not be given for attempting to run your own instance of RoVer, modified or otherwise.

1. To get RoVer ready to run locally, the first step is to clone this repository onto the machine you wish to run it on.
2. **Node.js version 8.9.4 LTS or newer is recommended to run RoVer.**
3. Use NPM to install the dependencies from the project folder: `npm i`
4. Edit the file `src/data/client.json` and insert your [bot token](https://discordapp.com/developers/applications/me).
5. Start the bot from the project folder: `node ./src/index.js`
6. You should set up a process manager like [PM2](http://pm2.keymetrics.io/) or forever.js to ensure that the bot remains online, or a systemd service if you're self-hosting on a systemd compatible linux distro.

### Creating a systemd service (Systemd-compatible Linux distros only)

1. Navigate to `/etc/systemd/system`
2. Make a new file with `nano` or `vim` with `.service` as the extension.
3. Now to create the service. You can customize it as you see fit, a sample service is below.
   ```
   [Unit]
   Description=Virgil autostart on boot
   Documentation=https://github.com/evaera/RoVer/wiki
   After=network.target

   [Service]
   Environment=NODE_PORT=3001
   Type=simple
   User=root (set this to another user if you're able to!)
   ExecStart=/usr/bin/node [path/to/index.js]
   Restart=on-failure

   [Install]
   WantedBy=multi-user.target
   ```

4. Save the file (presumably with the name you made for it in step two if you named it).
5. Enable the service: `sudo systemctl enable [name of service]`
6. Start the service: `sudo systemctl start [name of service]`
6b. If the bot is not online, check the logs with `sudo journalctl -eu [name of service]`

### Update Server

The *Update Server* is an optional part of RoVer that can be enabled in `client.json`. It is an HTTP server that can listen for requests and globally update a member in all guilds that the bot is in, similar to if they ran `!verify` in every guild. This is used internally on the hosted version for when the user verifies on verify.eryn.io, but you could use it for whatever purpose you wish.

### client.json options

```
    "token"             : String. The bot token that is used to log in to your bot.
    "lockNicknames"     : Boolean. Default false. If true, the bot will run DiscordServer.verifyMember every time
                          they begin typing. This will quickly eat up API requests if you aren't careful. Mostly
                          used on the hosted version.
    "updateServer"      : {
                          If this object is present, the update server will be started.

        "port"          : Integer. The port the Update server runs on.
        "apiKey"        : String. The API key the server checks against before updating the user.
    }
    "loud"              : Boolean. Default false. Logs every request made to stdout.
    "totalShards"       : Integer. Default auto. The number of shards to launch.
    "apiRequestMethod"  : String. Default 'sequential'. sequential' or 'burst'. Sequential executes all requests in the order
                          they are triggered, whereas burst runs multiple at a time, and doesn't guarantee a particular order.
    "owner"             : String. Default "0". The Discord ID of the bot's owner.
    "commandPrefix"     : String. Default "!". The prefix for commands.
    "shardLifeTime"     : Integer. Number of seconds each shard will run before closing.
    "mainLifeTime"      : Integer. Number of seconds the main process will run before closing. (Need a process manager if you want it to relaunch)
    "maxServerBindings" : Integer. Default unlimited. Maximum number of bindings allowed per server
    "reportWebhookURL"  : String. Webhook used to notify game moderators of exploiters when using the report command.
    "serviceKeyPath"    : String. Path to service key file that authenticates bot with Google Cloud Storage.
    "bucket"            : String. Google Cloud Storage bucket used to store game ban information.
    "fromAddress"       : String. Email address that appears in the 'From' field.
    "mailgunApiKey"     : String. Base64 encoded api key provided by mailgun. (You must encode it yourself and make sure you add 'api:' to the beginning if you haven't already.)
    "mailgunDomain"     : String. Domain used to send email.
    "mailgunRegion"     : String. Default 'us'. Specifies the region to use for the Mailgun API.
    "databaseUser"      : String. Default 'postgres'. Username pg uses to connect.
    "databaseAddress"   : String. IP address or hostname of database to connect to.
    "databaseName"      : String. Default 'postgres'. Name of database to connect to.
    "databasePassword"  : String. Password of database user.
    "gameModeratorRole" : Integer. Role which are authorized to issue game bans/leaderboard blacklists.
    "gameModeratorUsers": Integer. User IDs which are authorized to issue game bans/leaderboard blacklists (is array).
    "banFilesPath"      : String. Path to directory which ban json files are stored (path cannot be relative).
    "appealsInvite"     : String. Discord server invite sent to the user when appeal is accepted.
```
