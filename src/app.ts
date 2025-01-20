// File: src/app.ts

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

import { AttachmentBuilder, Message } from 'discord.js'
import fs from 'fs'
import config from './config'
import server from './setup'
import { Command } from './types'
import { imageToImage, saveIncomingImages, textToImage } from './utils' // Import imageToImage
const client = server.client

client.once('ready', async () => {
  console.log(`Logged in as ${client.user?.tag}!`)
  // List all guilds
  console.log('Guilds:')
  client.guilds.cache.forEach((guild) => {
    console.log(` - ${guild.name}`)
  })
  // List all commands
  console.log('Commands:')
  client.commands.forEach((command) => {
    console.log(` - ${(command as Command).name}`)
  })
})

client.on('messageCreate', async (message: Message) => {
  // Ignore messages from bots
  if (message.author.bot) return

  // Check if message is directed at the bot
  const isBotMentioned =
    message.mentions.has(client.user?.id ?? '') || message.mentions.has(client.user?.toString() ?? '')

  // Handle 'hey' greeting command
  if (message.content.toLowerCase().startsWith('hey')) {
    return await message.reply(
      [
        `Hey there! You said **${message.content}**!`,
        '',
        `Try mentioning me in a message like this: <@!${client.user?.id}>`,
        '',
        'Or just reply to me, I will generate an image based off of your message.',
      ].join('\n'),
    )
  }

  // Process image generation requests
  if (isBotMentioned || message.reference?.messageId) {
    const prompt = message.content.replace(/<@\d+> ?/g, '').trim()
    const firstAttachment = message.attachments.first()
    let imagePaths: string[] = []

    try {
      // Send initial response
      const processingMessage = await message.reply(
        `Generating image for ${message.author.displayName}: \`${prompt}\`...`,
      )

      // Handle image generation
      if (firstAttachment) {
        const incomingPaths = await saveIncomingImages(firstAttachment)
        try {
          imagePaths = await imageToImage(incomingPaths[0], prompt)
          // Cleanup input image after processing
          incomingPaths.forEach((path) => fs.promises.unlink(path).catch(console.error))
        } catch (error) {
          // Cleanup input image on error
          incomingPaths.forEach((path) => fs.promises.unlink(path).catch(console.error))
          throw error
        }
      } else {
        imagePaths = await textToImage({ prompt })
      }

      // Send generated image
      const attachment = new AttachmentBuilder(imagePaths[0])
      await message.reply({ files: [attachment] })

      // Cleanup output image after sending
      imagePaths.forEach((path) => fs.promises.unlink(path).catch(console.error))

      // Clean up processing message
      await processingMessage.delete().catch(console.error)
    } catch (error) {
      console.error('Error generating image:', error)

      // Cleanup any remaining files
      imagePaths.forEach((path) => fs.promises.unlink(path).catch(console.error))

      // Handle error messaging
      try {
        // Send detailed error via DM
        await message.author.send(`Error generating image: ${error}`)

        // Send brief public notice
        await message.reply("I encountered an error. I've sent you the details via DM.")
      } catch (dmError) {
        // Fallback to public error message if DM fails
        await message.reply(`Failed to generate image. Please try again later.`)
      }
    }
  }
})

client.login(config.token)
// client.user?.setPresence({
//   activities: [
//     {
//       name: "Imperial Cult Painting",
//       type: ActivityType.Watching,
//     },
//   ],
// })
