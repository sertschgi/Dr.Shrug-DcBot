// require the SlashCommandBuilder
const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const { MessageEmbed, MessageButton, Message } = require('discord.js');
const wait = require('util').promisify(setTimeout);

// command
module.exports = {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Which role do you want?')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('add')
                .addRoleOption(option =>
                    option.setName('role')
                    .setDescription('which role?')
                    .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('remove')
                .addRoleOption(option =>
                    option.setName('role')
                    .setDescription('which role?')
                    .setRequired(true))),
    async execute(interaction, client) {
        const member = interaction.user;
        const role = interaction.options.getRole('role');
        const buildEmbed = (toEmbed, str) => {
            const embed = new MessageEmbed()
                .setTitle(`:white_check_mark:  rolle ${str}.`);
            return embed;
        }
        
        if(role.permissions.has("KICK_MEMBERS")) {
            await interaction.reply({content: 'Ich kann dir leider nicht diese Rolle geben :(', ephemeral: true});
            return;
        }

        if (interaction.options.getSubcommand() === 'add') {
			await interaction.member.roles.add(role);
            await interaction.reply({embeds: [buildEmbed(member, 'hinzugefügt')]});
		} else if (interaction.options.getSubcommand() === 'remove') {
			await interaction.member.roles.remove(role);
            await interaction.reply({embeds: [buildEmbed(member, 'entfernt')]});
		}
        
        
    },
};