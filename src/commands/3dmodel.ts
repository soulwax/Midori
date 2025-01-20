// File: src/commands/3dmodel.ts

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

// src/commands/3dmodel.ts
// Import required modules and types
import { CommandInteraction } from 'discord.js'
import { execImageGeneration } from '../exec'
import { RequestBodyOptions } from '../types'

export const name = '3dmodel'
export const description = 'This command will generate 3d model art.'

export const execute = async (interaction: CommandInteraction) => {
  const prompt = interaction.options.get('prompt', true)?.value?.toString() as string
  const options: RequestBodyOptions = {
    prompt: `3D model render, highly detailed 3D geometry, octane render, perfect lighting, ${prompt}`,
    negativePrompt: 'blurry, noisy, low quality, flat, 2D, sketch, drawing',
  }
  execImageGeneration(interaction, options)
}
