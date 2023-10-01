// src/commands/diffuse.js
import { EmbedBuilder } from 'discord.js'
import get from 'axios'
import { parse } from 'node-html-parser'

module.exports = {
  name: 'diffuse',
  description: 'Diffuse a message',
  async execute(msg: string) {
    const url = 'https://www.stablenet.org/diffuse.php'
    const params = { message: msg }
    const { data } = await get(url, { params })
    const root = parse(data)
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Stable Diffusion v2.1')
      .setURL(url)
      .setDescription(root.querySelector('div')?.text || 'No message found')
    return embed
  },
}
