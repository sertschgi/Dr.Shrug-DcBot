// require the SlashCommandBuilder
const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const { MessageEmbed, Permissions, Guild } = require('discord.js');
const { ALL } = require('dns');
const wait = require('util').promisify(setTimeout);

// command
module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mute Someone!')
        .addUserOption(option =>
            option.setName('name')
            .setDescription('The name of the one to mute :)')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('time')
            .setDescription('How long should the one be muted? (sec, min, h, d)')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
            .setDescription('what is the reason? (optional) :)')
            .addChoice('Raumthema', 'verfehlte das Raumthema.')
            .addChoice('Spam', 'spamte.')
            .addChoice('Beleidigen', 'beleidigte.') 
            .addChoice('Einladung', 'sendete eine Einladung an Schüler nicht in unserer Klasse.')
            .setRequired(false)),
    async execute(interaction, client) {
        const member = interaction.options.getMember('name');
        const time = (interaction.options.getString('time'));
        const reason = interaction.options.getString('reason');
        const memberRolesBefore = member.roles.cache;
        const filter = m => interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS);
        let role = interaction.guild.roles.cache.find(role => role.name === 'muted');
        let indication = '';
        try {
            indication = time.match(/[^ *\d* *]\D*$/g)[0];
        } catch {
            indication = '';
        }
        var timeToMute = parseInt(time.match(/[^ *]\d*/g));

        const buildEmbed = (toEmbed) => {
            const embed = new MessageEmbed()
                .setTitle(`:white_check_mark:  ${toEmbed.user.username} gemuted.`)
            return embed;
        }

        if(interaction.user.id == client.user.id) {
            await interaction.reply(`<@${interaction.user.id}> wollte mich stummschalten. :rolling_eyes: `);
            return;
        };

        if(member.user.id == interaction.user.id) {
            await interaction.reply(`<@${interaction.user.id}> wollte sich selbst stummschalten. :face_with_raised_eyebrow: `);
            return;
        }
        

        if(member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
            await interaction.reply(`<@${interaction.user.id}> wollte gerade ernsthaft versuchen einen Server-Verwalter stummzuschalten. :expressionless: `)
            return;
        }

        if(!interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
            await interaction.reply({content: 'Du hast nicht genug Rechte :(', ephemeral: true});
            return;
        }

        if(!role) {
            console.log('creating new muterole'); 
            interaction.guild.roles.create({name: 'muted', permissions: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.CONNECT, Permissions.FLAGS.CONNECT, Permissions.FLAGS.SPEAK, Permissions.FLAGS.USE_APPLICATION_COMMANDS]});
            role = interaction.guild.roles.cache.find(role => role.name === 'muted');
        }

        if(role.permissions.has(Permissions.FLAGS.SEND_MESSAGES)) {
            role.permissions.remove(Permissions.FLAGS.SEND_MESSAGES);
        }

        if(!timeToMute) {
            await interaction.reply({content: 'Bitte gib eine richtige Zeit an. :slight_smile: ', ephemeral: true});
        }

        switch(indication) {
            case 'sec':
                break;
            case 'd': 
                timeToMute *= 24;
            case 'h':
                timeToMute *= 60;
            default:
                timeToMute *= 60 * 1000;
                break;
        }

        console.log(timeToMute);
        

        if(!reason) {
            interaction.reply(`<@${member.user.id}> hat sich nicht benommen.`);
        } else {
            await interaction.reply(`<@${member.user.id}> ${reason}`);
        }

        
        await wait(2000);

        
        member.roles.remove(member.roles.cache);
        
        if(member.roles.cache === memberRolesBefore) return;
        
        member.roles.add(role);

        await interaction.followUp({embeds: [buildEmbed(member)]});

        interaction.reply(item.question, { fetchReply: true }).then(() => {
            interaction.channel.awaitMessages({ filter, max: 1, time: timeToMute, errors: ['time'] })
                .then(collected => {
                    interaction.followUp(`${collected.first().author} wurde entmutet.`);
                })
                .catch(collected => {
                    interaction.followUp(`@${member.user.id}> kann jezt wieder schreiben :)`);
                });
        });


        member.roles.add(memberRolesBefore);
        
    },
};