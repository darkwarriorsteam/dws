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
exports.MessageHandler = void 0;
var FileManager_1 = require("./FileManager");
var index_1 = require("./index");
var MessageHandler = /** @class */ (function () {
    function MessageHandler() {
    }
    MessageHandler.prototype.handleServerMessage = function (msg) {
        return __awaiter(this, void 0, void 0, function () {
            var verificationManager, ticketingManager, eventRoleManager, member, args, file;
            return __generator(this, function (_a) {
                verificationManager = index_1.MainProcess.getVerificationManager();
                ticketingManager = index_1.MainProcess.getTicketingManager();
                eventRoleManager = index_1.MainProcess.getEventRoleManager();
                //Return if author is bot
                if (msg.author.bot)
                    return [2 /*return*/];
                //Return if channel type is direct message channel
                if (msg.channel.type === 'dm')
                    return [2 /*return*/];
                member = msg.guild.member(msg.author);
                //!!verification command
                if (msg.content.startsWith('!!verification')) {
                    if (!member.roles.cache.some(function (role) { return role.name === 'OWNER'; })) {
                        console.log("Verification Service || User " + msg.author.tag + " tried to create the verification message whilst no permission to do so.");
                        msg.delete();
                        return [2 /*return*/];
                    }
                    if (verificationManager.messageId === null || verificationManager.guildId === null || verificationManager.channelId === null) {
                        verificationManager.sendValidationMessage(msg);
                        console.log("Verification Service || User " + msg.author.tag + " created the verification message in channel " + msg.channel + ".");
                    }
                    else {
                        msg.channel.send("There is already a verification message in a channel. Channel ID: " + verificationManager.channelId);
                        console.log("Verification Service || User " + msg.author.tag + " tried to overwrite the verification message.");
                    }
                    msg.delete();
                    return [2 /*return*/];
                }
                //!!resetv
                else if (msg.content.startsWith('!!resetv')) {
                    if (!member.roles.cache.some(function (role) { return role.name === 'OWNER'; })) {
                        console.log("Verification Service || User " + msg.author.tag + " tried to reset the verification message whilst no permission to do so.");
                        return [2 /*return*/];
                    }
                    verificationManager.resetVerificationData();
                    verificationManager.refreshOnReset();
                    console.log("Verification Service || Reset was successful. Initiated by " + msg.author.tag);
                    msg.delete();
                }
                //!!ticket
                else if (msg.content.startsWith('!!ticket')) {
                    args = msg.content.split(' ');
                    if (args.length === 2) {
                        //ticket start command
                        if (args[1].toLowerCase() === 'start') {
                            //start the ticket listener
                            ticketingManager.startListening(msg.guild);
                            file = FileManager_1.BotFiles.ticketing();
                            file.data.guildId = msg.guild;
                            FileManager_1.FileManager.write(FileManager_1.BotFiles.ticketing.prototype.path(), file);
                        }
                    }
                    else if (args.length === 3) {
                        //init command for channel setup
                        if (args[1].toLowerCase() === 'init') {
                            //init community channel
                            if (args[2].toLowerCase() === 'support' || args[2].toLowerCase() === 's') {
                                //do community channel setup
                                msg.channel.send('Setting up!');
                                ticketingManager.setupSupportChannel(msg.channel);
                                msg.channel.send('Setting up done!');
                            }
                            else if (args[2].toLowerCase() === 'team' || args[2].toLowerCase() === 't') {
                                //do team channel setup
                                ticketingManager.setupTeamChannel(msg.channel);
                            }
                        }
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    MessageHandler.prototype.getUserFormMention = function () {
        //not implemented
    };
    //returns the role mentioned in a message
    //the method extracts the roleId from the the string mention (format: "<@&roleId>") by slicing the first 3 and the last char
    //example:
    //
    // for mention = '<@&778718072848121916>' the method will return the 'Event'-Role as a Discord.Role
    //
    MessageHandler.prototype.getRoleFromMention = function (mention, guild) {
        //if mention is undefined or null return undefined as it cannot be a valid role
        if (!mention)
            return undefined;
        //if the mention has the right syntax then slice the string
        if (mention.match('(<@&)([0-9]+)(>))')) {
            //slice off the first 3 and the last character to get the id
            //
            // <@&id> => (<@&)  id  (>)
            //
            mention = mention.slice(3, -1);
            //return the role found in the guild via the id
            //if the role doesnt exist or the id isn't correct guild.roles.cache.get(id) will evaluate to undefined therefore
            //  returning undefined for missing role or wrong id format
            return guild.roles.cache.get(mention);
        }
        //return undefined if mention is not following the pattern <@&
        return undefined;
    };
    return MessageHandler;
}());
exports.MessageHandler = MessageHandler;
