import Discord, { Message, MessageEmbed, User } from 'discord.js';

export class EmbedBuilder {

  static getVerificationEmbed(): MessageEmbed {
    const embed: MessageEmbed = new Discord.MessageEmbed()
      .setColor('#ff0000')
      .setTitle(':wave: WILLKOMMEN')
      .setDescription('Um ein gutes Miteinander und eine schöne Atmosphäre für uns Gamer schaffen zu können gibt es folgende Regeln:')
      .addField('1.', 'Ihr müsst mindestens 16 Jahre alt sein um unseren Server nutzen zu dürfen. Erfahren wir dass ihr nicht 16 Jahre alt ' +
      'seid bitten wir euch unseren Server zu verlassen. Ausnahmen sind möglich. Wendet euch dafür aber bitte ebenfalls an <@&388781681768792086>')
      .addField('2.', 'Der Umgang miteinander sollte stets freundlich und respektvoll sein. Wir sind alle zum Spaß hier.')
      .addField('3.', 'Bitte verwendet die entsprechenden und thematisch passenden Kanäle für eure Kommunikation')
      .addField('4.', 'Diskriminierung, andere belästigen, bedrohen oder anderweitig schikanieren wird nicht toleriert')
      .addField('5.', 'Das posten von Links zu schädlichen und rechtswidrigen Inhalten ist nicht gestattet')
      .addField('6.', 'Politische oder religiöse Unterhaltungen sind untersagt und werden ohne Verwarnung bestraft')
      .addField('7.', 'Private Daten (Telefonnummern, Adressen, Passwörter etc.) dürfen nicht öffentlich ausgetauscht werden.')
      .addField('8.', 'Avatare dürfen keine rechtswidrigen Inhalte haben')
      .addField('9.', 'Sämtlicher NSFW Content ist untersagt')
      .addField('10.', 'Keine Fremdwerbung')
      .addField('\u200b', 'Bitte haltet diesen Discord freundlich und einladend. Sollte euch jemand auffallen der diese Regeln nichtbefolgt, ' +
      'kontaktiert gerne einen <@&388781681768792086> oder <@&227511143936032768>')
      .addField('\u200b', 'Bei Fragen wendet euch gerne über den <#388770271349440532> Channel direkt an das Server-Team.Um der Community beizutreten akzeptiere mit :white_check_mark: die Regeln.')
      .setTimestamp()
      .setAuthor('DarkWarriors Team', 'https://cdn.discordapp.com/icons/225279143934296070/41a551a5fb2f005439e63c3a59824288.png?size=256')
      .setFooter('Wir wünschen euch viel Spaß auf unserem Server :D');
    return embed;
  }

  static getTicketingEmbed(user: User, content: string): MessageEmbed {
    const embed: MessageEmbed = new Discord.MessageEmbed()
      .setColor('#ff0000')
      .setDescription(content)
      .addField('Support angefordet von:', `<@${user.id}>`)
      .setTimestamp()
      .setAuthor(user.username, user.avatarURL()!)
      .setThumbnail('https://cdn.discordapp.com/icons/225279143934296070/41a551a5fb2f005439e63c3a59824288.png?size=256')
      .setFooter('DarkWarriors-Support');
    return embed;
  }
}