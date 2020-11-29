"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketingManager = void 0;
var EmbedBuilder_1 = require("./EmbedBuilder");
var FileManager_1 = require("./FileManager");
var TicketingManager = /** @class */ (function () {
    function TicketingManager() {
        this.channelId = null;
        this.teamChannelId = null;
        this.initialized = false;
    }
    TicketingManager.prototype.init = function () {
        this.fetchChannelIds();
        this.initialized = true;
    };
    TicketingManager.prototype.startListening = function (guild) {
        if (!this.initialized)
            this.init();
        if (this.teamChannelId === null || this.channelId === null)
            throw new Error('No Setup for Ticket-Managing');
        var ticketCommunityChannel = guild.channels.cache.get(this.channelId);
        var ticketTeamChannel = guild.channels.cache.get(this.teamChannelId);
        if (!ticketCommunityChannel.isText())
            return;
        if (!ticketTeamChannel.isText())
            return;
        var msgCollector = ticketCommunityChannel.createMessageCollector(function () { return true; }, {});
        var supportContent = {};
        msgCollector.on('collect', function (msg) {
            if (supportContent[msg.author.id] !== undefined) {
                var currentContent = supportContent[msg.author.id].content;
                if (currentContent !== undefined || currentContent !== null) {
                    currentContent += "\n\n" + msg.content;
                }
                else {
                    currentContent = msg.content;
                }
                supportContent[msg.author.id].content = currentContent;
                var tO = supportContent[msg.author.id].timeout;
                if (tO !== null || tO !== undefined) {
                    clearTimeout(tO);
                }
            }
            else {
                supportContent[msg.author.id] = {
                    content: msg.content,
                    timeout: null
                };
            }
            var timeout = setTimeout(function () {
                var user = msg.author;
                var embed = EmbedBuilder_1.EmbedBuilder.getTicketingEmbed(user, supportContent[user.id].content);
                ticketTeamChannel.send(embed).then(function () {
                    user.send('Deine Supportanfrage hat uns gerade erreicht. Wir versuchen dir so schnell wie möglich zu helfen :D');
                    user.send(embed);
                    supportContent[user.id] = undefined;
                });
            }, 30000);
            supportContent[msg.author.id].timeout = timeout;
        });
    };
    TicketingManager.prototype.fetchChannelIds = function () {
        var file = FileManager_1.BotFiles.ticketing();
        this.channelId = file.data.channelId;
        this.teamChannelId = file.data.teamChannelId;
    };
    TicketingManager.prototype.setupSupportChannel = function (channel) {
        var file = FileManager_1.BotFiles.ticketing();
        file.data.channelId = channel.id;
        FileManager_1.FileManager.write(FileManager_1.BotFiles.ticketing.prototype.path(), file);
    };
    TicketingManager.prototype.setupTeamChannel = function (channel) {
        var file = FileManager_1.BotFiles.ticketing();
        file.data.teamChannelId = channel.id;
        FileManager_1.FileManager.write(FileManager_1.BotFiles.ticketing.prototype.path(), file);
    };
    return TicketingManager;
}());
exports.TicketingManager = TicketingManager;
