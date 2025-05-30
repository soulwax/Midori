// File: src/commands/neonpunk.ts

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

// src/commands/neonpunk.ts
// Import required modules and types
import { CommandInteraction } from 'discord.js'
import { execImageGeneration } from '../exec'
import { RequestBodyOptions } from '../types'

export const name = 'neonpunk'
export const description = 'This command will attempt neon-punk.'

export const execute = async (interaction: CommandInteraction) => {
  const prompt = interaction.options.get('prompt', true)?.value?.toString() as string
  const options: RequestBodyOptions = {
    prompt: `cyberpunk style, neon lights, futuristic city, bright glowing elements, ${prompt}`,
    negativePrompt: 'natural lighting, daylight, vintage, rustic',
  }
  execImageGeneration(interaction, options)
}
