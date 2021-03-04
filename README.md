<p align="center">
    <a href="https://eryn.io/RoVer/"><img src="/assets/Logo_Text.svg" alt="RoVer" height="150" /></a>
</p>

<p align="center">
    <a href="https://discord.com/oauth2/authorize?client_id=298796807323123712&scope=bot&permissions=402656264"><img src="/assets/Add_RoVer.png" alt="Add" /></a>
</p>

<p align="center">
  <a href="https://www.patreon.com/erynlynn"><img src="http://i.imgur.com/dujYlAK.png" alt="Patreon"></a>
  <a href="https://standardjs.com"><img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" alt="JavaScript Style Guide"></a>
  <a href="https://eryn.io/RoVer"><img src="https://img.shields.io/badge/verified%20users-4M%2B-brightgreen.svg" alt="Verified Users"></a>
  <a href="https://eryn.io/RoVer"><img src="https://img.shields.io/badge/total%20servers-108K%2B-brightgreen.svg" alt="Discord Servers"></a>
  <br>
  <a href="https://discord.gg/7yfwrat"><img src="https://img.shields.io/discord/425800792679645204.svg" alt="Discord"></a>
</p>

<h1 align="center"><a href="https://rover.link/#readme">Documentation can be found on the RoVer website</a></h1>

## Self-hosting instructions
Self-hosting is recommended for advanced users only who are experienced with the Node.js ecosystem. Note that setup or code support will not be given for attempting to run your own instance of RoVer, modified or otherwise.

1. To get RoVer ready to run locally, the first step is to clone this repository onto the machine you wish to run it on.
2. **Node.js version 12 LTS or newer is required to run Virgil.**
3. Use NPM to install the dependencies from the project folder: `npm i`
4. Edit the file `src/data/client.json` and insert your [bot token](https://discord.com/developers/applications/me).
5. Start the bot from the project folder: `node ./src/index.js`
6. You should set up a process manager like [PM2](http://pm2.keymetrics.io/) or forever.js to ensure that the bot remains online, or a systemd service if you're self-hosting on a systemd compatible linux distro.

### Creating a systemd service (This assumes your distro ships with systemd)

1. Create a system user for the systemd service: `sudo adduser --system --no-create-home --disabled-login --group virgil`
2. Add the system user as a group to the files: `sudo chown -R yourusername:virgil *`
3. Give the group write permissions to the files: `sudo chmod -R +w yourusername *`
4. Navigate to `/etc/systemd/system`
5. Make a new file using your favorite text editor with `.service` as the extension.
6. Now to create the service. You can customize it as you see fit, a sample service is below.
   ```
   [Unit]
   Description=Virgil service
   Documentation=https://github.com/Wolftallemo/Virgil/blob/master/README.md
   After=network.target

   [Service]
   Type=simple
   User=virgil
   ExecStart=/usr/bin/node /full/path/to/index.js
   Restart=on-failure

   [Install]
   WantedBy=multi-user.target
   ```

   If you installed node using `snap`, the path of the node executable is `/snap/bin/node`

7. Save the file (presumably with the name you made for it in step two if you named it).
8. Enable the service: `sudo systemctl enable virgil`
9. Reload the systemd daemon: `sudo systemctl daemon-reload`
   If the bot is not online and/or errors occur when running commands, check the logs with `sudo journalctl -eu [name of service]`

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
    "cookie"            : String. The .ROBLOSECURITY cookie of the bot account used to fetch premium information of a user. (Not required if you're not using the premium virtualgroup, but whois will not report premium information correctly)
    "maxServerBindings" : Integer. Default unlimited. Maximum number of bindings allowed per server
    "reportWebhookURL"  : String. Webhook used to notify game moderators of exploiters when using the report command.
    "serviceKeyPath"    : String. Path to service key file that authenticates bot with Google Cloud Storage.
    "bucket"            : String. Google Cloud Storage bucket used to store game ban information.
    "fromAddress"       : String. Email address that appears in the 'From' field.
    "mailgunApiKey"     : String. Api key provided by mailgun (This will be base64 encoded automatically).
    "mailgunDomain"     : String. Domain used to send email.
    "mailgunRegion"     : String. Default 'us'. Specifies the region to use for the Mailgun API.
    "databaseUser"      : String. Default 'postgres'. Username pg uses to connect.
    "databaseAddress"   : String. IP address or hostname of database to connect to.
    "databaseName"      : String. Default 'postgres'. Name of database to connect to.
    "databasePassword"  : String. Password of database user.
    "gameModeratorRole" : Integer. Role which are authorized to issue game bans/leaderboard blacklists.
    "gameModeratorUsers": Integer. User IDs which are authorized to issue game bans/leaderboard blacklists (is array).
    "appealsInvite"     : String. Discord server invite sent to the user when appeal is accepted (this can also be a custom URL if you have one).
```
