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

import { Attachment, AttachmentBuilder, Message } from 'discord.js'
import config from './config'
import server from './setup'
import { Command } from './types'
import { imageToImage, saveIncomingImages, textToImage } from './utils' // Import imageToImage
const client = server.client

const VERBOSE = config.verbose

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

// This area is for autoreplying to mentions and replies aside from '/'-commands
client.on('messageCreate', async (message: Message) => {
  const wasRepliedTo: boolean = message.mentions.has(client.user?.id ?? '')
  const doesMentionMyself: boolean = message.mentions.has(client.user?.toString() ?? '')
  const wasRepliedToByABot: boolean = message.author.bot
  const firstAttachment: Attachment | undefined = message.attachments.first() as Attachment

  const prompt = message.content.replace(/<@\d+> ?/g, '')
  if (message.content.startsWith('hey')) {
    await message.reply(
      [
        `Hey there! You said **${message.content}**!`,
        '',
        `Try mentioning me in a message like this: <@!${client.user?.id}>`,
        '',
        `Or just reply to me, I will generate an image based off of your message. :pepiwumpy:`,
      ].join('\n'),
    )
  }
  if ((doesMentionMyself || wasRepliedTo) && !wasRepliedToByABot) {
    try {
      const firstPost = `Generating image for ${message.author.displayName}: \`${prompt}\`...`
      if (VERBOSE) console.log(firstPost)
      await message.reply(`${firstPost}`)

      let imagePaths: string[] = []

      if (firstAttachment) {
        const incomingImagePath: string[] = await saveIncomingImages(firstAttachment)
        imagePaths = await imageToImage(incomingImagePath[0], prompt)
      } else {
        imagePaths = await textToImage({ prompt })
      }

      const attachment = new AttachmentBuilder(imagePaths[0])
      await message.reply({ files: [attachment] })
    } catch (error) {
      console.error('Error generating image:', error)
      // Send error as DM to avoid cluttering the channel
      try {
        await message.author.send(`Error generating image: ${error}`)
        // Send a brief public response indicating error was sent via DM
        await message.reply({
          content: "I encountered an error. I've sent you the details via DM.",
        })
      } catch (dmError) {
        // Fallback if DM fails
        await message.reply({
          content: `Error: ${error}`,
        })
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
