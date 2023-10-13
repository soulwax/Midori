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

// src/commands/comicbook.ts
// Import required modules and types
import { AttachmentBuilder, CommandInteraction } from 'discord.js'
import config from '../config'
import { textToImage } from '../utils'
const VERBOSE = config.verbose

// Define the command
export const name = 'comicbook'
export const description = 'This command will generate comic book art.'

export const execute = async (interaction: CommandInteraction) => {
  const prompt = interaction.options.get('prompt', true) // Get the 'prompt' option

  const promptText = prompt.value?.toString() as string
  const member = interaction.member?.toString() as string
  // Check for mentions and replies
  const firstPost = `Generating Photo for ${member}: \`${prompt.value}\`...`
  if (VERBOSE) {
    console.log(`/${name} ${promptText} was executed by ${member} in #${interaction.channel?.url}`)
  }
  try {
    await interaction.reply(firstPost)
    const paths = await textToImage({
      prompt: promptText,
      stylePreset: 'comic-book',
      negativePrompt: 'blurry, bad, ugly, low quality',
    })
    const attachment = new AttachmentBuilder(paths[0])
    await interaction.followUp({ files: [attachment] })
  } catch (error) {
    console.error(error)
    try {
      await interaction.followUp(`Something went wrong: ${error}`)
    } catch (error) {
      console.error(error)
    }
  }
}
