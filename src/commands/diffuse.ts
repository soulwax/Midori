/*
Copyright (C) 2023 github@soulwax

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

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
