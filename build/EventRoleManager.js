"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRoleManager = void 0;
var _1 = require(".");
var EmbedBuilder_1 = require("./EmbedBuilder");
var FileManager_1 = require("./FileManager");
var EventRoleManager = /** @class */ (function () {
    function EventRoleManager() {
        this.channelId = '';
        this.teamChannelId = '';
        this.roleId = '';
        this.initialized = false;
        this.ongoing = false;
    }
    EventRoleManager.prototype.init = function () {
        this.fetchChannelIds();
        this.initialized = true;
    };
    EventRoleManager.prototype.startListening = function (guild) {
        var _this = this;
        if (!this.initialized)
            this.init();
        var channel = guild.channels.cache.get(this.channelId);
        if (!channel || !channel.isText()) {
            console.log("EventService || Event-ChannelID not defined in " + FileManager_1.BotFiles.events.prototype.path());
            return;
        }
        var c = channel.createMessageCollector(function () { return true; }, /*{ time: 604800000}*/ { time: 20000 });
        this.ongoing = true;
        var eventChannel = guild.channels.cache.get(this.teamChannelId);
        if (!eventChannel || !eventChannel.isText()) {
            console.log("EventService || Team-ChannelID not defined in " + FileManager_1.BotFiles.events.prototype.path());
            c.stop('NoChannelForRegistersFound');
            return false;
        }
        var eventRole = channel.guild.roles.cache.get(this.roleId);
        if (!eventRole) {
            console.log("EventService || Event-RoleID not defined in " + FileManager_1.BotFiles.events.prototype.path());
            eventChannel.send('ERROR: Event-Role not defined in events.json. Use !!event role @ROLE to initialize role');
            c.stop('NoEventRoleFound');
            return false;
        }
        var userIds = [];
        var contents = [];
        c.on('collect', function (msg) {
            var user = msg.author;
            var member = msg.guild.member(user);
            if (userIds.includes(user.id))
                return;
            var embed = EmbedBuilder_1.EmbedBuilder.getEventRegistrationEmbed(user, msg.content, false);
            eventChannel.send(embed);
            embed = EmbedBuilder_1.EmbedBuilder.getEventRegistrationEmbed(user, msg.content, true);
            userIds.push(user.id);
            contents.push(msg.content);
            user.send(embed).then(function (msg) { return __awaiter(_this, void 0, void 0, function () {
                var rC;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, msg.react('❌')];
                        case 1:
                            _a.sent();
                            rC = msg.createReactionCollector(function () { return true; }, {});
                            rC.on('collect', function (reaction, user) {
                                if (reaction.emoji.name !== '❌') {
                                    reaction.users.remove(user);
                                    console.log("Verification Service || User " + user.tag + " reacted with " + reaction.emoji.name + ". Reaction was removed succesfully");
                                    return false;
                                }
                                if (userIds.includes(user.id)) {
                                    var i = userIds.indexOf(user.id);
                                    userIds.splice(i, 1);
                                    contents.splice(i, 1);
                                }
                                console.log(userIds, contents);
                                reaction.message.delete();
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
            console.log("EventService || User " + user.tag + " registered to participate in Event");
            member.roles.add(eventRole);
            console.log("EventService || User " + user.tag + " received Event-Role");
        });
        c.on('end', function (collected, reason) {
            if (reason === "NoChannelForRegistersFound")
                return;
            if (reason === "NoEventRoleFound")
                return;
            var json = collected.toJSON();
            if (!json[0])
                return;
            var guild = _1.MainProcess.getClient().guilds.cache.get(json[0].guildID);
            var channel = guild.channels.cache.get(json[0].channelID);
            if (!channel.isText())
                return;
            for (var key in json) {
                if (json.hasOwnProperty(key)) {
                    var msg = channel.messages.cache.get(json[key].id);
                    msg.delete();
                }
            }
            console.log(userIds, contents);
            var embed = EmbedBuilder_1.EmbedBuilder.getEventSummaryEmbed(userIds, contents);
            if (embed !== null)
                eventChannel.send(embed);
            console.log("EventService || Event-Registration period ended");
            _this.ongoing = false;
            _this.initialized = false;
            userIds = [];
            contents = [];
        });
        console.log("EventService || Started Listeners");
        return true;
    };
    EventRoleManager.prototype.fetchChannelIds = function () {
        var file = FileManager_1.BotFiles.events();
        this.channelId = file.data.channelId;
        this.teamChannelId = file.data.teamChannelId;
        this.roleId = file.data.roleId;
        console.log("EventService || Fetched variables from " + FileManager_1.BotFiles.events.prototype.path());
    };
    EventRoleManager.prototype.setupRegistrationChannel = function (channel) {
        var file = FileManager_1.BotFiles.events();
        file.data.channelId = channel.id;
        FileManager_1.FileManager.write(FileManager_1.BotFiles.events.prototype.path(), file);
        console.log("EventService || Wrote Registration-ChannelID to " + FileManager_1.BotFiles.events.prototype.path());
    };
    EventRoleManager.prototype.setupEventLogChannel = function (channel) {
        var file = FileManager_1.BotFiles.events();
        file.data.teamChannelId = channel.id;
        FileManager_1.FileManager.write(FileManager_1.BotFiles.events.prototype.path(), file);
        console.log("EventService || Wrote Event-ChannelID to " + FileManager_1.BotFiles.events.prototype.path());
    };
    EventRoleManager.prototype.setupEventRole = function (role) {
        var file = FileManager_1.BotFiles.events();
        file.data.roleId = role.id;
        FileManager_1.FileManager.write(FileManager_1.BotFiles.events.prototype.path(), file);
        console.log("EventService || Wrote Event-RoleID to " + FileManager_1.BotFiles.events.prototype.path());
    };
    return EventRoleManager;
}());
exports.EventRoleManager = EventRoleManager;
