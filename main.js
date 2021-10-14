/*######################## VARS ########################*/

// requirering Client and Intents discord.js
const {
    Client,
    Intents,
    Guild,
    Collection
} = require('discord.js');

// requirering fs
const fs = require('fs');

// requirering token
const {token} = require('./config.json');

// client instance
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_PRESENCES]
});

// commands
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}



/*######################## MAIN ########################*/
 
// on ready
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// on interaction
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    
	const command = client.commands.get(interaction.commandName);

	if (!command) return;
	try {
		await command.execute(interaction, client);
	} catch (error) {
		console.error(error);
    }

});


/*~~~~~~~~ login with token ~~~~~~~~*/
client.login(token);