const Discord = require("discord.js")
const fs = require("fs")
const config = require("./config.json")

const client = new Discord.Client();

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err)
  files.forEach((file) => {
    const event = require(`./events/${file}`)

    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client))
  })
})

client.login(config.token)
