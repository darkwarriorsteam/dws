"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRoleManager = void 0;
//discontinued until version 3
var EventRoleManager = /** @class */ (function () {
    function EventRoleManager() {
    }
    EventRoleManager.prototype.listen = function (textChannel) {
        var c = textChannel.createMessageCollector(function () { return true; }, /*{ time: 604800000}*/ { time: 10000 });
        var registeredChannel = textChannel.guild.channels.cache.find(function (channel) { return channel.name.toLowerCase() === "event-anmeldungen"; });
        if (!registeredChannel.isText()) {
            c.stop('NoChannelForRegistersFound');
            return false;
        }
        var eventRole = textChannel.guild.roles.cache.find(function (role) { return role.name === "Event"; });
        c.on('collect', function (msg) {
            var user = msg.author;
            var dmChannel = user.dmChannel;
            var member = msg.guild.member(user);
            registeredChannel.send("Neue Anmeldung: " + msg.content + "\nDiscord-Name: " + user.tag);
            dmChannel.send("Du hast dich erfolgreich als " + msg.content + " zum Event angemeldet :D");
            member.roles.add(eventRole);
            msg.delete();
        });
        c.on('end', function (collected, reason) {
            if (reason === 'NoChannelForRegistersFound') {
                registeredChannel.send('Es gibt keinen #event-anmeldungen Channel! Bitte einrichten und Event neustarten.');
            }
            else {
                registeredChannel.send(collected.toJSON());
            }
        });
        return true;
    };
    return EventRoleManager;
}());
exports.EventRoleManager = EventRoleManager;
