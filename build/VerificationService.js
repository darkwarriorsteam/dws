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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationService = void 0;
var Discord = require('discord.js');
var EmbedBuilder_1 = require("./EmbedBuilder");
var fs_1 = __importDefault(require("fs"));
var index_1 = require("./index");
var VerificationService = /** @class */ (function () {
    function VerificationService() {
        this.messageId = this.channelId = this.guildId = null;
        this.rolesToAdd = this.rolesToRemove = this.defaultRoles = [];
    }
    VerificationService.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.refresh();
                console.log("Verification Service || Successfully refreshed data after restart.");
                if (this.messageId !== null && this.guildId !== null && this.channelId !== null) {
                    this.startListeners();
                    console.log("Verification Service || Started listeners for reactions on verification message. ID: " + this.messageId);
                }
                return [2 /*return*/];
            });
        });
    };
    VerificationService.prototype.sendValidationMessage = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var embed;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        embed = EmbedBuilder_1.EmbedBuilder.getVerificationEmbed();
                        return [4 /*yield*/, message.channel.send("<@&772200267227332628>")];
                    case 1:
                        _a.sent();
                        message.channel.send(embed).then(function (msg) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, msg.react('✅')];
                                    case 1:
                                        _a.sent();
                                        this.refreshFileData(msg);
                                        this.refresh();
                                        this.startListeners();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [2 /*return*/];
                }
            });
        });
    };
    VerificationService.prototype.refreshOnReset = function () {
        return __awaiter(this, void 0, void 0, function () {
            var guild, channel, msg;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        guild = index_1.MainProcess.getClient().guilds.cache.find(function (guild) { return guild.id === _this.guildId; });
                        channel = guild.channels.cache.get(this.channelId);
                        if (!channel.isText())
                            return [2 /*return*/];
                        return [4 /*yield*/, channel.messages.fetch(this.messageId)];
                    case 1:
                        msg = _a.sent();
                        this.refresh();
                        msg.delete();
                        return [2 /*return*/];
                }
            });
        });
    };
    VerificationService.prototype.refresh = function () {
        var file = require('./json/verification.json');
        this.messageId = file.data.verification.messageId;
        this.channelId = file.data.verification.channelId;
        this.guildId = file.data.verification.guildId;
        this.rolesToAdd = file.data.verification.rolesToAdd;
        this.rolesToRemove = file.data.verification.rolesToRemove;
        this.defaultRoles = file.data.verification.defaultRoles;
    };
    VerificationService.prototype.refreshFileData = function (msg) {
        var file = require('./json/verification.json');
        file.data.verification.messageId = msg.id;
        file.data.verification.channelId = msg.channel.id;
        file.data.verification.guildId = msg.guild.id;
        fs_1.default.writeFile('./json/verification.json', JSON.stringify(file), function (err) {
            console.log(err === null ? "No errors occoured during file writing" : "Error occoured during file writing: " + err);
        });
    };
    VerificationService.prototype.resetVerificationData = function () {
        var file = require('./json/verification.json');
        file.data.verification.messageId = null;
        file.data.verification.channelId = null;
        file.data.verification.guildId = null;
        fs_1.default.writeFile('./json/verification.json', JSON.stringify(file), function (err) {
            console.log(err === null ? "No errors occoured during file writing" : "Error occoured during file writing: " + err);
        });
    };
    VerificationService.prototype.startListeners = function () {
        return __awaiter(this, void 0, void 0, function () {
            var guild, channel, msg, c;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        guild = index_1.MainProcess.getClient().guilds.cache.find(function (guild) { return guild.id === _this.guildId; });
                        channel = guild.channels.cache.get(this.channelId);
                        if (!channel.isText())
                            return [2 /*return*/];
                        return [4 /*yield*/, channel.messages.fetch(this.messageId)];
                    case 1:
                        msg = _a.sent();
                        c = msg.createReactionCollector(function () { return true; }, { dispose: true });
                        c.on('collect', function (reaction, user) { return __awaiter(_this, void 0, void 0, function () {
                            var member, _a, _b, _i, i, _c, _d, _e, i;
                            var _this = this;
                            return __generator(this, function (_f) {
                                switch (_f.label) {
                                    case 0:
                                        if (reaction.emoji.name !== '✅') {
                                            reaction.users.remove(user);
                                            console.log("Verification Service || User " + user.tag + " reacted with " + reaction.emoji.name + ". Reaction was removed succesfully");
                                            return [2 /*return*/, false];
                                        }
                                        member = msg.guild.member(user);
                                        _a = [];
                                        for (_b in this.rolesToAdd)
                                            _a.push(_b);
                                        _i = 0;
                                        _f.label = 1;
                                    case 1:
                                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                                        i = _a[_i];
                                        return [4 /*yield*/, member.roles.add(msg.guild.roles.cache.find(function (role) { return role.name === _this.rolesToAdd[i]; }))];
                                    case 2:
                                        _f.sent();
                                        _f.label = 3;
                                    case 3:
                                        _i++;
                                        return [3 /*break*/, 1];
                                    case 4:
                                        console.log("Verification Service || Added " + this.rolesToAdd + " roles to " + user.tag);
                                        _c = [];
                                        for (_d in this.rolesToRemove)
                                            _c.push(_d);
                                        _e = 0;
                                        _f.label = 5;
                                    case 5:
                                        if (!(_e < _c.length)) return [3 /*break*/, 8];
                                        i = _c[_e];
                                        return [4 /*yield*/, member.roles.remove(msg.guild.roles.cache.find(function (role) { return role.name === _this.rolesToRemove[i]; }))];
                                    case 6:
                                        _f.sent();
                                        _f.label = 7;
                                    case 7:
                                        _e++;
                                        return [3 /*break*/, 5];
                                    case 8:
                                        console.log("Verification Service || Removed " + this.rolesToRemove + " roles from " + user.tag);
                                        console.log("Verification Service || Member " + user.tag + " verified.");
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        c.on('remove', function (reaction, user) { return __awaiter(_this, void 0, void 0, function () {
                            var member, i;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        member = msg.guild.member(user);
                                        return [4 /*yield*/, member.roles.remove(member.roles.cache)];
                                    case 1:
                                        _a.sent();
                                        for (i in this.defaultRoles) {
                                            member.roles.add(msg.guild.roles.cache.find(function (role) { return role.name === _this.defaultRoles[i]; }));
                                        }
                                        console.log("Verification Service || Removed all roles from " + user.tag + " and given back the defaults. (" + this.defaultRoles + ")");
                                        console.log("Verification Service || Member " + user.tag + " unverified.");
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [2 /*return*/];
                }
            });
        });
    };
    return VerificationService;
}());
exports.VerificationService = VerificationService;
