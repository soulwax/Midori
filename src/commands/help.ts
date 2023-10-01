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

// src/commands/help.js
import { ClientWithCommands, Command } from '../types'
import { CommandInteraction } from 'discord.js'


// Define your command
export const name = 'help'
export const description = 'Lists all available commands.'

export const execute = async (interaction: CommandInteraction) => {
  // Go through all commands and create a list of them, then format like this: 
  // Commands:
  // - command1 : description1
  // - command2 : description2
  // etc...
  const commands = (interaction.client as ClientWithCommands).commands.map((command) => {
    const cmd = command as Command
    return `\t **${cmd.name}** : ${cmd.description}\n`
  })
  // Reply with the list
  await interaction.reply(`Available commands: \n-${commands.join('-')}`)
}
