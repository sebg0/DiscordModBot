const Discord = require("discord.js")
const mongo = require("../mongo")
const infractionsSchema = require("../schemas/infractions-schema")

exports.run = async (client, message, args) => {
  if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You don't have the correct permissions to use this command!");

  var person = message.mentions.users.first();
  if (!person) return message.channel.send("Please mention a user you would like to mute!");

  if (!message.guild.members.cache.get(person.id)) return message.channel.send("That user is not in the server!");

  if (person.id === message.author.id) return message.channel.send("Why would you want to mute yourself?");

  if (message.member.roles.highest.position <= message.guild.members.cache.get(person.id).roles.highest.position) return message.channel.send("You can't mute that user because your highest role is not above their highest role.");

  var muterole = message.guild.roles.cache.find((r) => r.name === "Muted");
  if (!muterole) return message.channel.send("Please make a role called `Muted` before continuing with this command.");

  var reason = args.splice(1).join(" ");
  if (!reason) {
    reason = "No reason provided";
  }

  var muteperson = await message.guild.members.cache.get(person.id);

  try {
    await muteperson.roles.add(muterole);
  } catch (e) {
    message.channel.send(
      "Error: Make sure the `Muted` role is below my highest role!"
    );
    return;
  }

  var puncode = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < 10; i++) {
    puncode += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  var userembed = new Discord.MessageEmbed()
    .setColor("#FF5050")
    .setDescription(`You were muted in **${message.guild.name}**`)
    .addField("Reason", reason, true)
    .addField("Infraction ID", puncode, false)
    .setTimestamp();

  try {
    person.send(userembed);
  } catch (e) {
    console.log(`Unable to DM user: ${person.tag}`);
  }

  var pundate = new Date()
  var month = pundate.getMonth() + 1;
  pundate = month + "/" + pundate.getDate() + "/" + pundate.getFullYear() + " " + pundate.getHours() + ":" + pundate.getMinutes() + "(UTC+0)";

  await new infractionsSchema({
    userId: person.id,
    authorId: message.author.id,
    code: puncode,
    type: "Mute",
    date: pundate,
    reason: reason,
  }).save();

  var confirmembed = new Discord.MessageEmbed()
    .setColor("#4BCC85")
    .setDescription(`${person} has been muted with ID \`${puncode}\``);

  message.channel.send(confirmembed);
};
