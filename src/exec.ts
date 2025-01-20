// File: src/exec.ts

import { AttachmentBuilder, CommandInteraction } from 'discord.js'
import config from './config'
import { RequestBodyOptions } from './types'
import { textToImage } from './utils'

const VERBOSE = config.verbose

export const execImageGeneration = async (interaction: CommandInteraction, options: RequestBodyOptions) => {
  const prompt = interaction.options.get('prompt', true) // Get the 'prompt' option
  const commandName = interaction.commandName // Get the command name
  const promptText = prompt.value?.toString() as string
  const member = interaction.member?.toString() as string

  const name = interaction.user.displayName
  // Check for mentions and replies
  const firstPost = `Executing ${commandName} for ${member}: \`${prompt.value}\`...`
  if (VERBOSE) {
    console.log(`/${name} ${promptText} was executed by ${member} in #${interaction.channel?.url}`)
  }
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
      await interaction.followUp(`Something went wrong: ${error}`)
    } catch (error) {
      console.error(error)
    }
  }
}
