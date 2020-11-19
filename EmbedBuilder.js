const Discord = require('discord.js');

EmbedBuilder = {
  buildVerificationEmbed: function buildEmbed() {
    const verficiationEmbed = new Discord.MessageEmbed()
      .setColor('#ff0000')
      .setTitle(':wave: WILLKOMMEN')
      .setDescription('Um der Community beizutreten akzeptiere mit :white_check_mark: die Regeln.')
      .setTimestamp()
      .setFooter('Wir wünschen euch viel Spaß auf unserem Server :D');
    return verficiationEmbed;
  }
}

module.exports = EmbedBuilder;