const Discord = require("discord.js")
const config = require("../config.json")

module.exports = async (client, message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(config.prefix)) return;

  try {
    const args = message.content.split(/ +/g)
    const cmd = args.shift().slice(config.prefix.length).toLowerCase()

    var file = require(`../commands/${cmd}.js`);
    file.run(client, message, args);
  } catch (e) {
    return;
  }
};
