// File: src/types.ts

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

// src/types.ts
import { Client, Collection, CommandInteraction } from 'discord.js'
export interface TextToImageRequestBody {
  prompt: string
  width: number
  height: number
  output_format?: string
  seed?: number
  cfg_scale?: number
  steps?: number
  samples?: number
  style_preset: string | undefined
  text_prompts: Array<{
    text: string
    weight: number
  }>
}

export interface TextToImageResponseBody {
  artifacts: Array<{
    seed: number
    base64: string
  }>
}
export interface Command {
  name: string
  description: string
  execute(interaction: CommandInteraction): Promise<void>
  createHeaders(): Record<string, string>
  createRequestBody(prompt: string): TextToImageRequestBody
  handleErrorResponse(response: Response): Promise<void>
  saveOutgoingImages(responseJSON: TextToImageResponseBody): string[]
  textToImage(prompt: string): Promise<string[]>
}

export interface ClientWithCommands extends Client {
  commands: Collection<string, unknown>
}

export interface RequestBodyOptions {
  prompt: string
  negativePrompt?: string
  stylePreset?: string
}

export interface ImageToImageRequestBody {
  init_image_mode: string
  image_strength: number
  steps: number
  width: number
  height: number
  seed: number
  cfg_scale: number
  samples: number
  text_prompts: Array<{ text: string; weight: number }>
}

export interface ImageToImageResponseBody {
  artifacts: Array<{ seed: number; base64: string }>
}
