// src/commands/diffuse.js

const { MessageEmbed } = require("discord.js");
const { get } = require("axios");
const { parse } = require("node-html-parser");

module.exports = {
  name: "diffuse",
  description: "Diffuse a message",
  async execute(msg) {
    const url = "https://www.stablenet.org/diffuse.php";
    const params = { message: msg };
    const { data } = await get(url, { params });
    const root = parse(data);
    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Stable Diffusion v2.1")
      .setURL(url)
      .setDescription(root.querySelector("div").text);
    return embed;
  },
};
