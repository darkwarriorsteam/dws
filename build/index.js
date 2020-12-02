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
exports.MainProcess = void 0;
var discord_js_1 = require("discord.js");
var client = new discord_js_1.Client({ partials: ['REACTION', 'MESSAGE', 'USER', 'CHANNEL', 'GUILD_MEMBER'] });
var VerificationService_1 = require("./VerificationService");
var MessageHandler_1 = require("./MessageHandler");
var process_1 = require("process");
var TicketingManager_1 = require("./TicketingManager");
var FileManager_1 = require("./FileManager");
var EventRoleManager_1 = require("./EventRoleManager");
//create classes to handle features
var mh = new MessageHandler_1.MessageHandler();
var vs = new VerificationService_1.VerificationService();
var tm = new TicketingManager_1.TicketingManager();
var erm = new EventRoleManager_1.EventRoleManager();
var MainProcess = /** @class */ (function () {
    function MainProcess() {
    }
    //returns TicketingManager instance
    MainProcess.getTicketingManager = function () {
        return tm;
    };
    //returns VerificationService instance
    MainProcess.getVerificationInstance = function () {
        return vs;
    };
    //returns VerificationService instance
    MainProcess.getEventRoleManager = function () {
        return erm;
    };
    //returns client object
    MainProcess.getClient = function () {
        return client;
    };
    MainProcess.loginClient = function () {
        //login client with token
        client.login(process.env.DCTKN);
    };
    MainProcess.assignEvents = function () {
        var _this = this;
        //when client is ready this event fires
        client.on('ready', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                //check if client user is null
                if (client.user === null) {
                    console.log("Client User is null");
                    process_1.exit;
                    return [2 /*return*/];
                }
                console.log("Logged in as " + client.user.tag);
                //make prototype.path for files
                FileManager_1.BotFiles.init();
                //start VerificationService instance
                vs.start();
                console.log(1, vs);
                return [2 /*return*/];
            });
        }); });
        //event fires when bot receives message from all sources
        client.on('message', function (msg) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                //handle message from guilds
                mh.handleServerMessage(msg);
                return [2 /*return*/];
            });
        }); });
    };
    return MainProcess;
}());
exports.MainProcess = MainProcess;
MainProcess.assignEvents();
MainProcess.loginClient();
