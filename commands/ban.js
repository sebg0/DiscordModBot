const Discord = require("discord.js")
const mongo = require("../mongo")
const infractionsSchema = require("../schemas/infractions-schema")

exports.run = async (client, message, args) => {
  if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("You don't have the correct permissions to use this command!");

  var person = message.mentions.users.first();
  if (!person) return message.channel.send("Please mention a user you would like to ban!");

  if (!message.guild.members.cache.get(person.id)) return message.channel.send("That user is not in the server!");

  if (person.id === message.author.id) return message.channel.send("Why would you want to ban yourself?");

  if (message.member.roles.highest.position <= message.guild.members.cache.get(person.id).roles.highest.position || person.id === message.guild.owner.id) return message.channel.send("You can't ban that user because your highest role is not above their highest role.");

  var reason = args.splice(1).join(" ");
  if (!reason) {
    reason = "No reason provided";
  }

  var banperson = await message.guild.members.cache.get(person.id);
  await banperson.ban({ reason: reason });

  var puncode = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < 10; i++) {
    puncode += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  var userembed = new Discord.MessageEmbed()
    .setColor("#FF5050")
    .setDescription(`You were banned in **${message.guild.name}**`)
    .addField("Reason", reason, true)
    .addField("Infraction ID", puncode, false)
    .setTimestamp();

  try {
    person.send(userembed);
  } catch (e) {
    console.log(`Unable to DM user: ${person.tag}`);
  }

  var pundate = new Date()
  month = pundate.getMonth() + 1;
  pundate = month + "/" + pundate.getDate() + "/" + pundate.getFullYear() + " " + pundate.getHours() + ":" + pundate.getMinutes() + "(UTC+0)";

  await new infractionsSchema({
    userId: person.id,
    authorId: message.author.id,
    code: puncode,
    type: "Ban",
    date: pundate,
    reason: reason,
  }).save();

  var confirmembed = new Discord.MessageEmbed()
    .setColor("#4BCC85")
    .setDescription(`${person} has been banned with ID \`${puncode}\``);

  message.channel.send(confirmembed);
};
