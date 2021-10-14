// require the SlashCommandBuilder
const {
    SlashCommandBuilder
} = require('@discordjs/builders');

// command
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Spiele Tischtennis')
        .addIntegerOption(option =>
            option.setName('difficulty')
            .setDescription('How difficult do you want it to be?')
            .setRequired(false)),
            
    async execute(interaction) {
        let difficulty = 0;
        if (interaction.options.getInteger('difficulty') != null) {
            difficulty = Math.abs(interaction.options.getInteger('difficulty'));
        }

        switch (Math.floor(Math.random() * 5 + difficulty)) {
            case 0:
                await interaction.reply('ping');
                break;
            case 1:
                await interaction.reply('pong');
                break;
            case 2:
                await interaction.reply('bub');
                break;
            case 3:
                await interaction.reply(`<@${interaction.user.id}> hat gewonnen!`);
                break;
            default:
                await interaction.reply('Ich habe gewonnen!');
                break;
        }
    },
};