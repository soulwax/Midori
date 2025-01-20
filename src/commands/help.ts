// File: src/commands/help.ts

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

// src/commands/help.ts
import { CommandInteraction } from 'discord.js'
import { ClientWithCommands, Command } from '../types'

// Define the command
export const name = 'help'
export const description = 'Lists all available commands.'

export const execute = async (interaction: CommandInteraction) => {
  // Go through all commands and create a list of them, then format like this:
  // Commands:
  // - command1 : description1
  // - command2 : description2
  // etc...
  // Sort the commands so that 'help' comes last
  const sortedCommands = (interaction.client as ClientWithCommands).commands.sort((a, b) => {
    const cmdA = a as Command
    const cmdB = b as Command

    if (cmdA.name === 'help') return 1
    if (cmdB.name === 'help') return -1
    return cmdA.name.localeCompare(cmdB.name)
  })

  // Map the sorted commands to their string representations
  const commands = sortedCommands.map((command) => {
    const cmd = command as Command
    const result = [
      `\t **/${cmd.name}** : ${cmd.description}`,
      ' - Respond to me and I will generate a /diffuse image for you.',
      ' - Respond with an image and I will enhance it.',
    ].join('\n')
    return result
  })

  // Reply with the list
  await interaction.reply(`Available commands: \n-${commands.join('-')}`)
}
