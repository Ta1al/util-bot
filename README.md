# Utility Bot
Contains some random utilities I use

### Command List
1. `Rawtext`: Context menu command - returns the message with escaped markdown
2. `Userinfo`: User command - return user info
3. `Reminder`: Chat Input command - a normal reminder command

4. `Eval`: Chat Input command - with default permissions disabled

### To host the bot
1. Run `npm i`
2. Update `example.env` and rename it to just `.env`
3. Manually register commands. (Command Data is included in the command files)
- https://canary.discord.com/developers/docs/interactions/application-commands#registering-a-command
4. Run `npm start`