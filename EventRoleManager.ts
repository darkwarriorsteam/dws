import { Collection, DMChannel, GuildChannel, GuildMember, Message, Role, TextChannel, User } from "discord.js";

//discontinued until version 3
export class EventRoleManager {

  listen(textChannel: TextChannel): boolean {
    const c = textChannel.createMessageCollector(() => true, /*{ time: 604800000}*/{time: 10000});
    const registeredChannel: GuildChannel = textChannel.guild.channels.cache.find(channel => channel.name.toLowerCase() === "event-anmeldungen")!;
    if(!registeredChannel.isText()) {
      c.stop('NoChannelForRegistersFound');
      return false;
    }
    const eventRole: Role = textChannel.guild.roles.cache.find(role => role.name === "Event")!;

    c.on('collect', (msg: Message) => {
      const user: User = msg.author;
      const dmChannel: DMChannel = user.dmChannel!;
      const member: GuildMember = msg.guild!.member(user)!;
      registeredChannel.send(`Neue Anmeldung: ${msg.content}\nDiscord-Name: ${user.tag}`);
      dmChannel.send(`Du hast dich erfolgreich als ${msg.content} zum Event angemeldet :D`);
      member.roles.add(eventRole);
      msg.delete();
    });

    c.on('end', (collected: Collection<string, Message>, reason: string) => {
      if(reason === 'NoChannelForRegistersFound') {
        registeredChannel.send('Es gibt keinen #event-anmeldungen Channel! Bitte einrichten und Event neustarten.');
      } else {
        registeredChannel.send(collected.toJSON());
      }
    });
    return true;
  }
}