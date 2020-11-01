const Discord = require("discord.js")
const mongo = require("../mongo")

module.exports = async (client) => {
  console.log(`Logged in as ${client.user.tag}`)
  client.user.setActivity("with seb", { type: "PLAYING" })
  await mongo()
};
