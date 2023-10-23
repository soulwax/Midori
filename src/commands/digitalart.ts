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

// src/commands/digitalart.ts
// Import required modules and types
import { CommandInteraction } from 'discord.js'
import { execDiscord } from '../exec'
import { RequestBodyOptions } from '../types'

export const name = 'digitalart'
export const description = 'This command will generate a digital art.'

export const execute = async (interaction: CommandInteraction) => {
  const options: RequestBodyOptions = {
    prompt: interaction.options.get('prompt', true)?.value?.toString() as string,
    stylePreset: 'digital-art',
    negativePrompt: 'blurry, bad, ugly, brush strokes',
  }
  execDiscord(interaction, options)
}
