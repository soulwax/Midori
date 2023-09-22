// initialize discord REST

const Discord = require("discord.js");
const config = require("./config");
const fs = require("fs");
const path = require("path");
const server = require("./setup"); // client, tracker, rest setup
// Plug in intents from config.intents

const intents = new Discord.Intents(config.intents);
server.client = new Discord.Client({ intents });

// Path: src/commands
// initialize commands

server.client.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync(path.join(__dirname, "commands"))
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(path.join(__dirname, "commands", `${file}`));
  server.client.commands.set(command.name, command);
}

// REST

(async () => {
  await server.client.login(config.token);
  console.log("Logged in as " + server.client.user.tag);
})();

server.client.on("message", async (message) => {
  // When mentioned, store the message in a variable
  if (message.mentions.has(server.client.user)) {
    const msg = message.content;
    // Treat the message as a prompt for stable diffusion v2.1
    try {
      const response = await server.client.commands.get("diffuse").execute(msg);
      message.channel.send(response);
    } catch (error) {
      console.error(error);
      message.channel.send("An error occurred while processing your request.");
    }
    console.log(msg);
  }
});
