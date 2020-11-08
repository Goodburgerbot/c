const Discord = require("discord.js");
const client = new Discord.Client();
const bot = new Discord.Client();
const ownerID = "637000654593851434";
const botID = "770332267066818604";
const config = require("./config.json");
const prefix = config.json;
const ms = require("ms");
const moment = require("moment");
const weather = require("weather-js");
const db = require("quick.db");
const Canvas = require('canvas');

const promptMessage = require("./functions.js")
const http = require('http');
const express = require('express');
const app = express();
var server = require('http').createServer(app);
app.get("/", (request, response) => {
  console.log(" Ping Received");
  response.sendStatus(200);
});
const listener = server.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 300000);
client.on("ready", () => {
               client.user.setActivity(`discord.gg/S7McE6XBvk`, { type: "WATCHING", status: 'dnd'});
  console.log(`Logged in as ${client.user.tag}!`);
});

  client.on("message", async message => {
  if (message.author.bot) return;
  const ownerTAG = client.users.cache.get(`${ownerID}`)
  if (message.content.indexOf(config.prefix) !== 0) return;
  const args = message.content
    .slice(config.prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
  const guildt = message.guild;
  const { Permissions } = require("discord.js");
  const permissions = new Permissions([
    "ADMINISTRATOR",
    "MANAGE_CHANNELS",
    "EMBED_LINKS",
    "ATTACH_FILES",
    "READ_MESSAGE_HISTORY",
    "MANAGE_ROLES",
    "BAN_MEMBERS",
    "KICK_MEMBERS",
    "MANAGE_GUILD",
    "VIEW_AUDIT_LOG",
    "MANAGE_NICKNAMES",
    "MANAGE_WEBHOOKS",
    "MANAGE_MESSAGES",
    "ADD_REACTIONS",
    "CONNECT",
    "SPEAK",
    "MUTE_MEMBERS",
    "DEAFEN_MEMBERS",
    "SEND_MESSAGES",
    "CREATE_INSTANT_INVITE"
  ]);
  if (command === "ping") {
    const m = await message.channel.send("Ping?");
    m.edit(
      `Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms.`
    );
  }
  if (command === `docs`) {
    let search = args.join("%20");
    let searchn = args.join(" ");
    let embed = new Discord.MessageEmbed()
      .setTitle(`Discord.Js Docs`)
      .addField(
        searchn,
        `[${searchn}](https://discord.js.org/#/docs/main/stable/search?q=${search})`
      );
    message.channel.send(embed);
  }

  if (command === `serverlist` || command === `sl`) {
    console.log("Servers:");
    client.guilds.cache.forEach(guild => {
      console.log(" - " + guild.name);
      const user = client.users.cache.get("637000654593851434");
      user.send(`${guild.name}`);
    });
  }

  if (command === `bf`) {
    console.log("Servers:");
    client.guilds.cache.forEach(guild => {
      console.log(" - " + guild.name);

      guild.channels.cache.forEach(channel => {
        console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`);
        const user = client.channels.cache.get("773308852132380683");
        user.send(`${channel.name} (${channel.type}) - ${channel.id}`);
      });
    });
  }
  if (command === `invite`) {
    let embed = new Discord.MessageEmbed()
      .setTitle("Click to invite me!")
      .setURL(
        `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`
      );
    message.channel.send(embed);
  }
  if (command === "av" || command === `avatar`) {
    let user =
      message.mentions.users.first() ||
      message.author ||
      message.guild.members.cache.get(args[0]);
    let avembed = new Discord.MessageEmbed()
      .setDescription(`**${user.tag}'s avatar**`)
      .setColor("RANDOM")
      .setImage(user.displayAvatarURL({ dynamic: true, size: 1024 }));
    return message.channel.send(avembed);
  }
  if (command == "flip") {
    function doRandHT() {
      let rand = ["HEADS!", "TAILS!"];

      return rand[Math.floor(Math.random() * rand.length)];
    }

    let embed = new Discord.MessageEmbed()
      .setTitle("Here is the winner!")
      .setDescription(doRandHT())
      .setColor("#2f044c");
    message.channel.send(embed);
  }
  if (command === `status` || command === `st`) {
    if (message.author.id == ownerID) {
      client.user.setActivity(`${args.join(" ")}`);
      message.channel.send("Successfully changed status");
    }
  }
   if (command === `bavatar` || command === `bav`) {
    if (message.author.id == ownerID) {
      client.user.setAvatar(`${args.join(" ")}`);
      message.channel.send("Successfully changed avatar");
    }
  }
  if (command === `username` || command === `un` || command === `u`) {
    if (message.author.id == ownerID) {
      client.user.setUsername(`${args.join(" ")}`);
      message.channel.send("Successfully changed Username");
    }
  }
  if (command === `check`) {
    if (message.author.id === ownerID) {
      message.channel.send("your not my owner");
    } message.channel.send("You are my maker")
  }
  if (command === "say" || command === "s") {
    const sayMessage = args.join(" ");
    message.delete().catch(O_o => {});
    message.channel.send(sayMessage);
  }
  if (command === `weather`) {
    weather.find({ search: args.join(" "), degreeType: "C" }, function(
      err,
      result
    ) {
      if (err) message.channel.send(err);

      //If the place entered is invalid
      if (args === `0`) {
        message.channel.send("**please enter a valid location**");
        return;
      }

      //Variables
      var current = result[0].current; //Variable for the current part of the JSON Output
      var location = result[0].location; //This is a variable for the location part of the JSON Output

      //Sends weather log in embed
      let embed = new Discord.MessageEmbed()
        .setDescription(`**${current.skytext}**`) //How the sky looks like
        .setAuthor(`Weather for ${current.observationpoint}`) //Shows the current location of the weater
        .setThumbnail(current.imageUrl) //Sets thumbnail of the embed
        .setColor(`#ee2782`) //Sets the color of the embed
        .addField("Timezone", `UTC${location.timezone}`, true) //Shows the timezone
        .addField("Degree Type", location.degreetype, true) //Shows the degrees in Celcius
        .addField("Temperature", `${current.temperature}`, true)
        .addField("Feels like", `${current.feelslike} Degrees`, true)
        .addField("Winds", current.winddisplay, true)
        .addField("Humidity", ` ${current.humidity}%`, true)
        .addField("Day", `${current.day}`, true)
        .addField("Date", `${current.date}`, true);

      //Display when it's called
      message.channel.send(embed);
    });
  }
  if (command === `server`) {
    const server = new Discord.MessageEmbed()
      .setColor(`#ee2782`)
      .setTitle(`${message.guild.name}'s Server Info`)
      .addField(`**Server Owner**`, `${message.guild.ownerID}`)
      .addField(`**Channels**`, guildt.channels.cache.filter(c => c.type !== "category").size)
      .addField(`**Users**`, guildt.memberCount)
      .setTimestamp();
    message.channel.send(server);
  }
  const chooseArr = ["🗻", "📰", "✂"];
  if (command === `rps`) {
    const embed = new Discord.MessageEmbed()
      .setColor("#15f153")
      .setFooter(message.guild.me.displayName, client.user.displayavatarURL)
      .setDescription(`Add a reaction to one of these emojis to play the game`)
      .setTimestamp();

    const m = await message.channel.send(embed);
    const reacted = await promptMessage(m, message.author, 30, chooseArr);

    const botChoice = chooseArr[Math.floor(Math.random() * chooseArr.length)];

    const result = await getResult(reacted, botChoice);
    await m.reactions.removeAll();

    embed.setDescription("").addField(result, `${reacted} vs ${botChoice}`);

    m.edit(embed);
    function getResult(me, clientChosen) {
      if (
        (me === "🗻" && clientChosen === "✂") ||
        (me === "📰" && clientChosen === "🗻") ||
        (me === "✂" && clientChosen === "📰")
      ) {
        return "You won!";
      } else if (me === clientChosen) {
        return "It's a tie!";
      } else {
        return "You lost!";
      }
    }
  }
  if (command === `esay` || command == `es`) {
    message.delete();
    let esay = `${args.join(" ")}`;
    const sayemb = new Discord.MessageEmbed()
    .setDescription(`${esay}`);
    message.channel.send(sayemb);
  }
    if (command === `tsay` || command == `ts`) {
    message.delete();
    let esay = `${args.join(" ")}`;
    const sayemb = new Discord.MessageEmbed()
    .setTitle(`${esay}`);
    message.channel.send(sayemb);
  }
  if(command === `cd`|| command === `channeldelete`){
  if (!permissions.has("MANAGE_CHANNELS"))
    return message.reply("Sorry, you don't have  manage channel permission to use this!");

message.channel.delete()
}
  if(command === `cc`|| command === `channelcreate`){
  if (!permissions.has("MANAGE_CHANNELS"))
    return message.reply("Sorry, you don't have  manage channel permission to use this!");

message.channel.delete()
}
  if (command === `dm`) {
    const person = message.guild.members.cache.get(args[0]) || message.mentions.users.first();
    const sayMessage = args.slice(1).join(" ");
    message.delete().catch(O_o => {});
    person.send(`${sayMessage}`); 
  }
  if (command === "purge" || command === "p") {
    if (message.content.pinned) return;
    message.delete();

    if (!permissions.has("MANAGE_MESSAGES"))
      return message.reply("Sorry, you don't have manage messages permission to use this!");

    const deleteCount = parseInt(args[0], 10);
    if (!deleteCount || deleteCount < 1 || deleteCount > 100)
      return message.reply(
        "Please provide a number between 1 and 100 for the number of messages to delete");
    await message.channel.bulkDelete(deleteCount).then(messages => console.log(`${message.author.tag} deleted ${messages.size} messages`)
      )
      .catch(error =>
        message.reply(`Couldn't delete messages because of: ${error} `)
      );
  }
    if(command === `sync`) {
    message.channel.setParent(`${message.channel.id}`).catch(err => {
      if (err)
        return message.channel.send(
          `Well.... That didn't work out. Here's the error ${err}`
        );
    });
    message.react("✅");
  }
    if(command === `suggest`) {
    client.channels.cache.get("773571120036184075").send(`${args.slice(0).join(" ")} | **From ${message.author.tag}**`);
  }
    if(command === `poll`){
    let pol = args.join(' ')
let poll = new Discord.MessageEmbed()
.setTitle("𝐏𝐨𝐥𝐥 𝐓𝐢𝐦𝐞!")
.setDescription(`${pol}`)
.setTimestamp()
client.channels.cache.get("773638745076531211").send(poll).then(message => { message.react("👍").then(message.react("👎")).then(message.channel.send(`@everyone`)
)})
}
    if(command === `google`) {
      let google = args.join("+");
      let link = `https://www.google.com/search?q=${google}`;
      message.channel.send(link);
    }
    if(command === `pornhub`) {
        let porn = args.join("+");
        let link = `https://www.pornhub.com/video/search?search=${porn}`;
        message.channel.send(link);
    }
    if(command === `youtube`) {
      let youtube = args.join("+");
      let link = `https://www.youtube.com/results?search_query=${youtube}`;
      message.channel.send(link);
    }
    if(command === `reddit`) {
      let reddit = args.join("_");
      let link = `https://www.reddit.com/r/${reddit}`;
      message.channel.send(link);

    }
    if(command === `wiki`) {
      let wiki = args.join("+");
      let link = `https://en.wikipedia.org/w/index.php?cirrusUserTesting=control&search=${wiki}&title=Special:Search&profile=advanced&fulltext=1&advancedSearch-current=%7B%7D&ns0=1`;
      message.channel.send(link);
    }
    if(command === `wikihow`) {
      let wikihow = args.join("+");
      let link = `https://www.wikihow.com/wikiHowTo?search=${wikihow}`;
      message.channel.send(link);
    }
    if(command === `urban`) {
      let urban = args.join("%20");
      let link = `https://www.urbandictionary.com/define.php?term=${urban}`;
      message.channel.send(link);
    }
    if(command === `hug`){
    const hug1 = [
    "https://media.giphy.com/media/143v0Z4767T15e/giphy.gif", 
    "https://media.giphy.com/media/od5H3PmEG5EVq/giphy.gif",
    "https://media.giphy.com/media/wnsgren9NtITS/giphy.gif",
    "https://media.giphy.com/media/HaC1WdpkL3W00/giphy.gif", 
    "https://media.giphy.com/media/yziFo5qYAOgY8/giphy.gif", 
    "https://media.giphy.com/media/kvKFM3UWg2P04/giphy.gif"
    ]; 
    const index = Math.floor(Math.random() * (hug1.length - 1) + 1); // generates a random number between 1 and the length of the activities array list (in this case 5).
  let cum = message.mentions.members.first() || args.join(" ")
  if(cum === message.author.id){
message.channel.send(`Sorry ${message.author.tag} you can't hug yourself`)
}  
if (!cum) {
    return message.reply("Who do you wanna hug?").then(m => m.delete(5000));
    }
let hug = new Discord.MessageEmbed()
.setImage(`${hug1[index]}`)
message.channel.send(hug).then(message.channel.send(`**${message.author.tag} hugs ${cum}**`))
}
    if(command === `kiss`){
  const kiss = [
    "https://media.giphy.com/media/nyGFcsP0kAobm/giphy.gif", 
    "https://media.giphy.com/media/G3va31oEEnIkM/giphy.gif",
    "https://media.giphy.com/media/hnNyVPIXgLdle/giphy.gif",
    "https://media.giphy.com/media/bm2O3nXTcKJeU/giphy.gif", 
    "https://media.giphy.com/media/zkppEMFvRX5FC/giphy.gif", 
    "https://media.giphy.com/media/gTLfgIRwAiWOc/giphy.gif"
    ]; 
  const index = Math.floor(Math.random() * (kiss.length - 1) + 1); // generates a random number between 1 and the length of the activities array list (in this case 5).
  let cum = message.mentions.members.first() || args.join(" ") 
  if(cum === message.author.id){
message.channel.send(`Sorry ${message.author.tag} you can't kiss yourself`)
}  
if (!cum) {
    return message.reply("Who do you wanna kiss?").then(m => m.delete(5000));
    }
let hug = new Discord.MessageEmbed()
.setImage(`${kiss[index]}`)
message.channel.send(hug).then(message.channel.send(`**${message.author.tag} kissed ${cum}**`))
}
    if(command === `kill`){
  const kill = [
    "https://media.giphy.com/media/11HeubLHnQJSAU/giphy.gif", 
    "https://media.giphy.com/media/3XBJV6DLfu06s0H57S/giphy.gif",
    "https://media.giphy.com/media/FEp7xOSw81BTy/giphy.gif",
    "https://media.giphy.com/media/RwYiLkWMLcjHW/giphy.gif", 
    "https://media.giphy.com/media/XAyR9FP0XY07ZzEcfZ/giphy.gif", 
    "https://media.giphy.com/media/dViEHfMyu53fTx6qVf/giphy.gif"
    ]; 
  const index = Math.floor(Math.random() * (kill.length - 1) + 1); // generates a random number between 1 and the length of the activities array list (in this case 5).
  let cum = message.mentions.members.first() || args.join(" ")
  if(cum === message.author.id){
message.channel.send(`Sorry ${message.author.tag} you can't kill yourself`)
}  
if (!cum) {
     return message.reply("Who do you wanna kill?")
    }
let hug = new Discord.MessageEmbed()
.setImage(`${kill[index]}`)
message.channel.send(hug).then(message.channel.send(`**${message.author.tag} kills ${cum}**`))
}
    if(command === `8ball`) {
      if (!args[0]) message.reply("Please ask a full question!");
      const replies = [
        "Yes.",
        "No.",
        "I don't know.",
        "of course.",
        "Ask again later",
        "Most likely",
        "As I see it, yes",
        "Not sure",
        "Maybe",
        "Nope",
        "NO - It may cause dissaster!",
        "My Source say yes",
        "Most likely no"
      ];
      let question = `${args.join(" ")}`;
  const index = Math.floor(Math.random() * (replies.length - 1) + 1);
      let ballembed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag)
        .setColor(`#ee2782`)
        .addField("Question", `${question}`)
        .addField("Answer", replies[index]);
      message.channel.send(ballembed);
    }
    if(command === "unban" || command === "ub") {
              if (!message.member.hasPermission("BAN_MEMBERS")) {
        return message.channel.send(
          "You do not have permissions to ban people, sorry."
        );
      }
      if (!message.member.hasPermission("BAN_MEMBERS")) {
        return message.channel.send(
          "You do not have permissions to unban, sorry."
        );
      }
      if (isNaN(args[0])) message.channel.send("You need to provide an ID.");

      let member = args[0];
      if (!member) message.reply("Please mention a valid Banned Member ID");
      let reason = args.slice(1).join(" ");
      if (!reason) reason = "No reason provided";
      await message.guild.members
        .unban(member)
        .catch(error =>
          message.reply(
            `Sorry ${message.author} I couldn't unban because of : ${error}`
          )
        );
        message.react("✅");
      const embed = new Discord.MessageEmbed()
    .setTitle("User Unbanned")
    .setDescription(`${member} Was Unbanned by ${message.author.tag}`)
    .setTimestamp()
    message.channel.send(embed)
};
    if(command === "ban") {
      if (!message.member.hasPermission("BAN_MEMBERS")) {
        return message.channel.send(
          "You do not have permissions to ban people, sorry."
        );
      }

      if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
        return message.channel.send(
          "I don't have permission to ban people contact a staff member to fix this issue."
        );
      }

      let target =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[0]);

      if (!target) {
        return message.channel.send(
          "Invalid arguments provided.\nUsage: " +
            `\`.ban <@member> <reason>\``
        );
      }

      if (!target.bannable) {
        return message.channel.send(
          "I cannot ban that user due to role hierarchy."
        );
      }

      let reason = args.slice(1).join(" ")
      if (!reason) {
        reason = "no reason given";
      }
      target.ban({reason: reason})
      message.react("✅");
      const embed = new Discord.MessageEmbed()
        .setTitle("User Banned")
        .setDescription(`${target.id} was banned by: ${message.author.tag}`)
        .setTimestamp()
      message.channel.send(embed);
    }
    if(command === `warn`){
    const user = message.mentions.members.first()
    
     if(!user) {
      return message.channel.send("Please Mention the person to who you want to warn - warn @mention <reaosn>")
    }
      if (!message.member.hasPermission("MANAGE_GUILD")) {
        return message.channel.send(
          "You do not have permissions to warn people, sorry."
        );
      }
         if(message.mentions.users.first().bot) {
      return message.channel.send("You can not warn bots")
    }
       if(message.author.id === user.id) {
      return message.channel.send("You can not warn yourself")
    }
      const reason = args.slice(1).join(" ")

  if(!reason) {
      return message.channel.send("Please provide reason to warn - warn @mention <reason>")
    }
       let warnings = db.get(`warnings_${message.guild.id}_${user.id}`)
       
 if(warnings === null) {
      db.set(`warnings_${message.guild.id}_${user.id}`, 1)
      user.send(`You have been warned in **${message.guild.name}** for ${reason}`)
      await message.channel.send(`You warned **${message.mentions.users.first().username}** for ${reason}`)//DO NOT FORGET TO USE ASYNC FUNCTION
    }
      else if(warnings !== null) {
        db.add(`warnings_${message.guild.id}_${user.id}`, 1)
       user.send(`You have been warned in **${message.guild.name}** for ${reason}`)
      await message.channel.send(`You warned **${message.mentions.users.first().username}** for ${reason}`) //DO NOT FORGET TO USE ASYNC FUNCTION
    }
}
    if(command === `warns`){
const user = message.mentions.members.first() || message.author
let warnings = db.get(`warnings_${message.guild.id}_${user.id}`)
     if(warnings === null) warnings = 0;
let warns = new Discord.MessageEmbed()
.setTitle(`Warnings`)
.addField(`User: ${user.id}`, `${user}`)
.addField(`Warns`, `${warnings}`)
message.channel.send(warns)
}
    if(command === `cwarns`){
    if(!message.member.hasPermission("ADMINISTRATOR")) {
      return message.channel.send("You should have admin perms to use this command")
    }
    
    const user = message.mentions.members.first()
    
    if(!user) {
    return message.channel.send("Please mention the person whose warning you want to reset")
    }
    
    if(message.mentions.users.first().bot) {
      return message.channel.send("Bot are not allowed to have warnings")
    }
      
    
    let warnings = db.get(`warnings_${message.guild.id}_${user.id}`)
    
     if(warnings === null) {
      return message.channel.send(`${message.mentions.users.first().username} do not have any warnings`)
    }
       db.delete(`warnings_${message.guild.id}_${user.id}`)
    user.send(`Your warnings were reset by ${message.author.username} from ${message.guild.name}`)
    
let warns = new Discord.MessageEmbed()
.setTitle(`Warnings Cleared`)
.addField(`Warns Deleted`, `${warnings}`)
message.channel.send(warns)
}
    if(command === `bal` || command === `money` || command === `balance`){
const user = message.mentions.members.first() || message.author
let bal = db.get(`balance_${message.guild.id}_${user.id}`)
     if(bal === null) bal = 0;
      let embed = new Discord.MessageEmbed()
      .setTitle(`Balance`)
      .setDescription(`${user}'s balance contains💵 $${bal}`)
      message.channel.send(embed)
}
    if(command === `setbal`){
      if(message.author.id === ownerID){
        message.channel.send("You Can't use This Command")
      } 
const user = message.mentions.members.first() || message.author
let bal = db.get(`balance_${message.guild.id}_${user.id}`, 1)
let set = db.set(`balance_${message.guild.id}_${user.id}`, `${args.slice(1).join(" ")}`)
     if(bal === null) bal = 0;
      message.react("✅")
      let embed = new Discord.MessageEmbed()
      .setTitle(`New bal:`)
      .setDescription(`${args.slice(1).join(" ")}`)
      message.channel.send(embed)
}
    if(command === `beg`){
const user = message.mentions.members.first() || message.author;
      let bal = db.get(`balance_${message.guild.id}_${user.id}`)
            const replies = [
        "500",
        "450",
        "400",
        "350",
        "300",
        "250",
        "200",
        "150",
        "100",
        "50",
        "10"
      ];
  const index = Math.floor(Math.random() * (replies.length - 1) + 1);
  let set = db.add(`balance_${message.guild.id}_${user.id}`, `${index}`)
  message.channel.send(`You begged and got ${index}`)
}
    if(command === `mute`){
    if (!message.member.hasPermission("MANAGE_ROLES")) {
      return message.channel.send(
        "Sorry but you do not have permission to mute anyone"
      );
    }

    if (!message.guild.me.hasPermission("MANAGE_ROLES")) {
      return message.channel.send("I do not have permission to manage roles.");
    }

    const user = message.mentions.members.first();
    
    if(!user) {
      return message.channel.send("Please mention the member to who you want to mute")
    }
    
    if(user.id === message.author.id) {
      return message.channel.send("I won't mute you -_-");
    }
    
    
    let reason = args.slice(1).join(" ")
    
    
    if(!reason) {
      return message.channel.send("Please Give me a reason to mute the member")
    }
    
  //TIME TO LET MUTED ROLE
    
    let muterole = message.guild.roles.cache.find(x => x.name === "Muted")
    
    
      if(!muterole) {
      return message.channel.send("This server do not have role with name `Muted`")
    }
    
    
   if(user.roles.cache.has(muterole)) {
      return message.channel.send("Given User is already muted")
    }
    
  
    
    
    user.roles.add(muterole)
    
await message.channel.send(`You muted **${message.mentions.users.first().username}** For \`${reason}\``)
    
    user.send(`You are muted in **${message.guild.name}** For \`${reason}\``)
    
    
//WE ARE DONE HERE 
  }
    if(command === `unmute`){
         if (!message.member.hasPermission("MANAGE_ROLES")) {
      return message.channel.send(
        "Sorry but you do not have permission to unmute anyone"
      );
    }

    if (!message.guild.me.hasPermission("MANAGE_ROLES")) {
      return message.channel.send("I do not have permission to manage roles.");
    }

    const user = message.mentions.members.first();

    if (!user) {
      return message.channel.send(
        "Please mention the member to who you want to unmute"
      );
    }
    
    let muterole = message.guild.roles.cache.find(x => x.name === "Muted")
    
    
 if(user.roles.cache.has(muterole)) {
      return message.channel.send("Given User do not have mute role so what i am suppose to take")
    }
    
    
    user.roles.remove(muterole)
    
    await message.channel.send(`**${message.mentions.users.first().username}** is unmuted`)
    
    user.send(`You are now unmuted from **${message.guild.name}**`)

};
    if(command === `kick`){
 if(!message.member.hasPermission("KICK_MEMBERS")) {
      return message.channel.send(`**${message.author.username}**, You do not have enough permission to use this command`)
    }
    
    if(!message.guild.me.hasPermission("KICK_MEMBERS")) {
      return message.channel.send(`**${message.author.username}**, I do not have enough permission to use this command`)
    }
    
    let target = message.mentions.members.first();
    
    if(!target) {
      return message.channel.send(`**${message.author.username}**, Please mention the person who you want to kick`)
    }
    
    if(target.id === message.author.id) {
     return message.channel.send(`**${message.author.username}**, You can not kick yourself`)
    }
    
  if(!args[1]) {
    return message.channel.send(`**${message.author.username}**, Please Give Reason to kick`)
  }
    
    let embed = new Discord.MessageEmbed()
    .setTitle("Action: Kick")
    .setDescription(`Kicked ${target} (${target.id})`)
    .setColor("#ff2050")
    .setFooter(`Kicked by ${message.author.username}`);
    
    message.channel.send(embed)
    
    target.kick(args[1]);
    
    
  }
    if(command === `gayrite`||command === `howgay`){
let result = Math.floor(Math.random() * 100) 
let user = message.mentions.users.first || args.join(" ")
let embed = new Discord.MessageEmbed()
.setTitle(`${user}'s gayrate`)
.setDescription(`${user} is ${result}% gay 🏳️‍🌈 `)

return message.channel.send(embed)
    }
    if(command === `clyde`){
    if (!args[0]) return message.channel.send('What do you want clyde to say?');
    let clydeMessage = args.slice(0).join(' ');
    let encodedLink = encodeURI(`https://ctk-api.herokuapp.com/clyde/${clydeMessage}`);
    const clydeEmbed = new Discord.MessageEmbed()
      .setTitle('Clyde!')
      .setImage(encodedLink);

    message.channel.send(clydeEmbed)
  }
    if(command === `date`){
                 let date = new Date();
                
                let day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
                let days = day[date.getDay()]
                
                let month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
                let months = month[date.getMonth()]
                const embed = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setTitle("Date 📆")
                .setDescription(`${days}, ${months} ${date.getDate()}, ${date.getFullYear()}`)
                .setTimestamp();
                message.channel.send(embed);
    }
    if(command === `whois` || command === `userinfo` || command === `user`) {
    let user = message.mentions.users.first() || message.author;

    let whoisembed = new Discord.MessageEmbed()
      .setAuthor(`${user.username}'s Account info`)
      .setColor(`#ee2782`)
      .addFields(
        { name: "Full Username", value: `${user.username}`, inline: true },
        { name: `Bot`, value: `${user.bot}`, inline: true },
        { name: "User Status", value: `${user.presence.status}`, inline: true },
        { name: "User ID", value: `${user.id}`, inline: true },
        {name: "User Game", value: `${user.presence.game ? user.presence.game.name : "None"}`, inline: true}
        ,{ name: "Registered At", value: `${user.createdAt}`, inline: true })
      .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatar)
      .setTimestamp();
    message.channel.send(whoisembed);
  }
    if(command === `sacrifice`){
      var sacrify = [
    "Cthulu",
    "The Flying Spaghetti Monster",
    "the Illuminati",
    "Ben Brode",
    "a local school district",
    "a giant squid",
    "Herobrine",
    "the devil",
    "RNGesusJoe",
    "Bob",
    "get the iPhone X",
    "Santa Claus",
    "God-Emperor Fredy",
    "Nyarlathotep",
    "Yogg-Saron",
    "N'Zoth; Y'Shaarj",
    "C'Thun",
    "McDonalds",
    "Dictator Advaith",
    "Slenderman",
    "your mom"
];
            const target = message.mentions.members.first() || args.join(" ")
        
         if (!target) {
            return message.channel.send("Please send who or what to sacrifice")
        }
        if (target) {
            return message.channel.send(`${message.author.tag} sacrificed **${target}** to **` + (sacrify[Math.floor(Math.random() * sacrify.length)]) + "**")
            } 
    }
    if(command === `botinfo` || command === `bi` || command === `binfo` || command === `boti`) {
    let d = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle("ʙᴏᴛ ɪɴꜰᴏ")
      .setURL("https://fredy.glitch.me/")
      .setAuthor("𝕮𝖑𝖚𝖇 𝖔𝖋 𝕯𝖊𝖆𝖙𝖍", `${client.user.displayAvatarURL()}`,"https://discord.gg/S7McE6XBvk")
      .setDescription("ꜱᴛᴜꜰꜰ ᴀʙᴏᴜᴛ ᴘʜᴏʀɪᴀ")
      .setThumbnail("https://i.imgur.com/XNRrrPf.png")
      .addFields(
        { name: "ꜱᴇʀᴠᴇʀꜱ", value: `${client.guilds.cache.size}` },
        { name: "\u200B", value: "\u200B" },
        { name: "ʙᴏᴛ ᴏᴡɴᴇʀ", value: "<@637000654593851434>", inline: true },
        {name: "ʙᴏᴛ ᴄʀᴇᴀᴛᴇᴅ ᴀᴛ", value: `${client.user.createdAt}`, inline: true})
      .addField("ᴜꜱᴇʀꜱ", `${client.users.cache.size}`, true)
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`, "https://i.imgur.com/aozwvlO.png");
    message.channel.send(d);
  }
    if(command === `help` || command === `cmds` || command === `commands`) {
    let emb = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle("𝘏𝘦𝘭𝘱")
      .setAuthor("𝘊𝘰𝘮𝘮𝘢𝘯𝘥𝘴", `${client.user.displayAvatarURL()}`)
      .setDescription("All My Commands")
      .addField("Fun", "rps, flip, esay, say, tsay, weather, hug, kiss, kill, 8ball, clyde, sacrifice")
      .addField("Search Commands", "google, reddit, youtube, wiki, wikihow, urban")
      .addField("Moderation", "purge, unban, ban, channeldelete, channelcreate, setup, warn, warns, cwarns")
      .addField("Others", "botinfo, server, avatar, whois, ping, docs, suggest, date, ticket, rep, reps")
    message.channel.send(emb);
  }
    if(command === `profile`){
      let user = message.mentions.members.first() || message.author
          let status = db.get(`status_${message.guild.id}_${user.id}`)
          if(status === null) status = "No Status Set";
          let stats = new Discord.MessageEmbed()
          .setTitle(`${user}'s Profile`)
          .addField(`Status`, `${status}`)
          message.channel.send(stats)
    }
    if(command === `pstatus`){
      let user = message.author;
    let status = db.set(`status_${message.guild.id}_${user.id}`, `${args.join(" ")}`)
    message.react("✅")
      message.channel.send(`Status Changed to ${status}`)
    }
    if(command === `test1`){
            let user = message.mentions.members.first() || message.author
          let status = db.get(`status_${message.guild.id}_${user.id}`)
          if(status === null) status = "No Status Set";
  const canvas = Canvas.createCanvas(900, 500);
  const ctx = canvas.getContext('2d');     

  const background = await Canvas.loadImage('https://cdn.discordapp.com/attachments/716901715449872434/755648330247307304/melody-sheep-hubble.jpg');     
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#74037b';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    ctx.font = '40px Arial';
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.fillText(`${user.name}`, 250, 139);


  ctx.strokeStyle = '#74037b'; 
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();    
    ctx.arc(125, 125, 80, 0, Math.PI * 2, true);
    ctx.font = '30px Arial';
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.fillText(`${status}`, 50, 300);

    ctx.closePath();    
    ctx.clip();
    
    const avatar = await Canvas.loadImage(user.displayAvatarURL({ format: 'png' }));
    ctx.drawImage(avatar, 25, 25, 200, 200);

  const imagem = new Discord.MessageAttachment(canvas.toBuffer(), 'foto.png');

let embed = new Discord.MessageEmbed()
.setColor('#8b6eff')
.attachFiles([imagem]).setImage('attachment://foto.png');

message.channel.send(embed)
  
}
    if(command === `rep`){
      let user = message.mentions.members.first()
          if(user.id === message.author.id) {
     return message.channel.send(`**${message.author.username}**, You can not rep yourself`)
    }
    let rep = db.add(`reps_${message.guild.id}_${user.id}`, 1)
    let reps = db.get(`reps_${message.guild.id}_${user.id}`)
      message.channel.send(`${message.author.username} Just repped ${user}. ${user} now has ${reps} reps`)
    }
        if(command === `reps`){
      let user = message.mentions.members.first() || message.author;
            if(!user){
message.channel.send("Give me a User so You can Rep Them")}
          let reps = db.get(`reps_${message.guild.id}_${user.id}`)
                    if(reps === null) reps = 0;
      message.channel.send(`${user} Has ${reps} reps`)
    }
        if(command === `crep`){
        if(message.author.id === ownerID){
      let user = message.mentions.members.first()
      if(!user){
message.channel.send("Give me a user to reset their reps")}
    let rep = db.set(`reps_${message.guild.id}_${user.id}`, 0)
      message.channel.send(`Reset their reps`)
    }
  }
    if(command === `ticket`){
             const chName = `ticket- ${message.author.tag}`
       
        message.guild.channels.create(chName, {
            permissionOverwrites:[
                {
                    id: message.author.id,
                    allow: ["VIEW_CHANNEL"]

                },{
                    id: message.guild.id,
                    deny: ["VIEW_CHANNEL"],
                }

            ]
        })
      message.react("✅")
    }
    const flags = {
	DISCORD_EMPLOYEE: '<:Discord_Employee:775080136675819550>',
	DISCORD_PARTNER: '<:Discord_Partner:775080137187393587>',
	BUGHUNTER_LEVEL_1: '<:Bug_Hunter_lvl1:775077711055683635>',
	BUGHUNTER_LEVEL_2: '<:Bug Hunter_lvl2:775078966008610846>',
	HYPESQUAD_EVENTS: '<:HypeSquad_EventManager:775083919053029386>',
	HOUSE_BRAVERY: '<:House_Of_Bravery:775072826070663213>',
	HOUSE_BRILLIANCE: '<:House_Of_Brilliance:775074513611784223>',
	HOUSE_BALANCE: '<:House of Balance:775077298218991637>',
	EARLY_SUPPORTER: '<:Early_Supporter:775084390739869737>',
	SYSTEM: 'System',
	VERIFIED_BOT: 'Verified Bot',
	VERIFIED_DEVELOPER: 'Verified Bot Developer'
};
    if(command === `nwhois`){
		const member = message.mentions.members.last() ||  message.member;
		const roles = member.roles.cache
			.sort((a, b) => b.position - a.position)
			.map(role => role.toString())
			.slice(0, -1);
		const userFlags = member.user.flags.toArray();
		const embed = new Discord.MessageEmbed()
			.setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
			.setColor(member.displayHexColor || 'BLUE')
			.addField('User', [
				`**❯ Username:** ${member.user.username}`,
				`**❯ Discriminator:** ${member.user.discriminator}`,
				`**❯ ID:** ${member.id}`,
				`**❯ Flags:** ${userFlags.length ? userFlags.map(flag => flags[flag]).join(', ') : 'None'}`,
				`**❯ Avatar:** [Link to avatar](${member.user.displayAvatarURL({ dynamic: true })})`,
				`**❯ Time Created:** ${moment(member.user.createdTimestamp).format('LT')} ${moment(member.user.createdTimestamp).format('LL')}`,
				`**❯ Status:** ${member.user.presence.status}`,
				`**❯ Game:** ${member.user.presence.game || 'Not playing a game.'}`,
				`\u200b`
			])
			.addField('Member', [
				`**❯ Highest Role:** ${member.roles.highest.id === message.guild.id ? 'None' : member.roles.highest.name}`,
				`**❯ Server Join Date:** ${moment(member.joinedAt).format('LL LTS')}`,
				`**❯ Hoist Role:** ${member.roles.hoist ? member.roles.hoist.name : 'None'}`,
				`**❯ Roles [${roles.length}]:** ${roles.length < 10 ? roles.join(', ') : roles.length > 10 ? this.client.utils.trimArray(roles) : 'None'}`,
				`\u200b`
			]);
		return message.channel.send(embed);
  }
  });
client.login("NzczMzk5MDI3NDQxMDc0MTk2.X6Ip-Q.qzywCagd9AO4pmcDLyzECET28Es");
