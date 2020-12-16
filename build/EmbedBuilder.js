"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmbedBuilder = void 0;
var discord_js_1 = __importDefault(require("discord.js"));
var EmbedBuilder = /** @class */ (function () {
    function EmbedBuilder() {
    }
    EmbedBuilder.getVerificationEmbed = function () {
        //create rules embed for VerificationManager
        var embed = new discord_js_1.default.MessageEmbed()
            //set color to RGB(255, 0, 0)
            .setColor('#ff0000')
            .setTitle(':wave: WILLKOMMEN')
            .setDescription('Um ein gutes Miteinander und eine schöne Atmosphäre für uns Gamer schaffen zu können gibt es folgende Regeln:')
            //add fields for rule entries
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
    };
    EmbedBuilder.getTicketingEmbed = function (user, content) {
        //create custom embed for ticket
        var embed = new discord_js_1.default.MessageEmbed()
            //set color to RGB(255, 0, 0)
            .setColor('#ff0000')
            .setDescription(content)
            //construct a discord @MENTION via syntax <@userId> and add a field to the embed
            //for example <@318750418316296195> will evalutate to '@NoRysq | Michi' on DarkWarriors-Discord-Server and will be clickable
            .addField('Support angefordet von:', "<@" + user.id + ">")
            .setTimestamp()
            //set the author of the embed to be the user and the image URL to the users avatarURL
            //user.avatarURL()! <- every user interacting with the bot has an avatarURL therefore it can't be undefined
            .setAuthor(user.username, user.avatarURL())
            .setThumbnail('https://cdn.discordapp.com/icons/225279143934296070/41a551a5fb2f005439e63c3a59824288.png?size=256')
            .setFooter('DarkWarriors-Support');
        return embed;
    };
    EmbedBuilder.getEventSummaryEmbed = function (userIds, contents) {
        //create custom embed for event registration summory
        var embed = new discord_js_1.default.MessageEmbed()
            //set color to RGB(255, 0, 0)
            .setColor('#ff0000')
            .setTitle('Event Anmeldungen:')
            .setTimestamp()
            .setThumbnail('https://cdn.discordapp.com/icons/225279143934296070/41a551a5fb2f005439e63c3a59824288.png?size=256')
            .setFooter('DarkWarriors-Events');
        var wentThrough = false; //<- true if the loop was executed, false if not
        for (var i = 0; i < userIds.length && userIds.length === contents.length; i++) {
            //get userId and message content from provided arrays
            var userId = userIds[i];
            var content = contents[i];
            //construct a discord @MENTION via syntax <@userId> and add a field to the embed
            //for example <@318750418316296195> will evalutate to '@NoRysq | Michi' on DarkWarriors-Discord-Server and will be clickable
            embed.addField(content, "<@" + userId + ">", true);
            wentThrough = true; //<- will indicate the loop has been went trough
        }
        return wentThrough ? embed : null; //<- only returns an embed when looped through the loop at least once
    };
    EmbedBuilder.getEventRegistrationEmbed = function (user, content, userEmbed) {
        //create custom embed to send in the channel to receive the registrations for events
        var embed = new discord_js_1.default.MessageEmbed()
            //set color to RGB(255, 0, 0)
            .setColor('#ff0000')
            //set the author of the embed to be the user and the image URL to the users avatarURL
            //user.avatarURL()! <- every user interacting with the bot has an avatarURL therefore it can't be undefined
            .setAuthor(user.username, user.avatarURL())
            //add user information to the embed
            .addField('Ingamename:', 'Discord-Tag:', true)
            //construct a discord @MENTION via syntax <@userId> and add a field to the embed
            //for example <@318750418316296195> will evalutate to '@NoRysq | Michi' on DarkWarriors-Discord-Server and will be clickable
            .addField(content, "<@" + user.id + ">", true)
            .setTimestamp()
            .setThumbnail('https://cdn.discordapp.com/icons/225279143934296070/41a551a5fb2f005439e63c3a59824288.png?size=256')
            .setFooter('DarkWarriors-Events');
        //check if embed is supposed to have a title and description
        //if userEmbed is true the embed is going to be sent out to the user and needs the following title and description
        //if userEmbed is false the embed is going to be sent to the team channel where the only information has to be message content and @TAG
        if (userEmbed) {
            embed.setTitle('Du hast dich erfolgreich zum Event angemeldet.')
                .setDescription('Um dich vom Event abzumelden reagiere unten mit ❌');
        }
        ;
        return embed;
    };
    return EmbedBuilder;
}());
exports.EmbedBuilder = EmbedBuilder;
