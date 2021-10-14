// require the SlashCommandBuilder
const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const { MessageEmbed, MessageButton, Message } = require('discord.js');
const wait = require('util').promisify(setTimeout);

// command
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban Someone!')
        .addUserOption(option =>
            option.setName('name')
            .setDescription('The name of the one to ban :)')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
            .setDescription('what is the reason? :)')
            .addChoice('Raumthema', 'verfehlte das Raumthema.')
            .addChoice('Spam', 'spamte.')
            .addChoice('Beleidigen', 'beleidigte.') 
            .addChoice('Einladung', 'sendete eine Einladung an Schüler nicht in unserer Klasse.')
            .setRequired(true)),
    async execute(interaction, client) {
        const member = interaction.options.getMember('name');
        const user = interaction.options.getUser('name')
        const reason = interaction.options.getString('reason');
        const buildEmbed = (toEmbed) => {
            const embed = new MessageEmbed()
                .setTitle(`:white_check_mark:  ${toEmbed.user.username} gebannt.`);
            return embed;
        }
        
        
        if(member.user.id == client.user.id) {
            await interaction.reply(`<@${interaction.user.id}> wollte mich bannen.`)
            //interaction.user.kick()
            await wait(2000);
            await interaction.followUp({embeds: [buildEmbed(interaction)]});
            return;
        };
        await interaction.reply(`<@${member.user.id}> ${reason}`);
        //member.kick
        await wait(2000);
        await interaction.followUp({embeds: [buildEmbed(member)]});
    },
};