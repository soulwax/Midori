// File: src/exec.ts

import { AttachmentBuilder, CommandInteraction } from 'discord.js'
import { RequestBodyOptions } from './types'
import { textToImage } from './utils'

export const execImageGeneration = async (interaction: CommandInteraction, options: RequestBodyOptions) => {
  const prompt = interaction.options.get('prompt', true)
  const commandName = interaction.commandName
  const member = interaction.member?.toString() as string

  const firstPost = `Executing ${commandName} for ${member}: \`${prompt.value}\`...`

  try {
    await interaction.reply(firstPost)
    const paths = await textToImage({
      prompt: options.prompt,
      stylePreset: options.stylePreset,
      negativePrompt: options.negativePrompt,
    })
    const attachment = new AttachmentBuilder(paths[0])
    await interaction.followUp({ files: [attachment] })
  } catch (error) {
    console.error(error)
    try {
      if (interaction.deferred) {
        await interaction.followUp({
          content: `Error: ${error}`,
          ephemeral: true,
        })
      } else {
        await interaction.reply({
          content: `Error: ${error}`,
          ephemeral: true,
        })
      }
    } catch (followUpError) {
      console.error('Error sending error message:', followUpError)
    }
  }
}
