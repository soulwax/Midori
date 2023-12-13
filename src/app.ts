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

import { ActivityType, Attachment, AttachmentBuilder, Message } from 'discord.js';
import config from './config';
import server from './setup';
import { Command } from './types';
import { imageToImage, saveIncomingImages, textToImage } from './utils'; // Import imageToImage

const VERBOSE = config.verbose

server.client.once('ready', async () => {
  console.log(`Logged in as ${server.client.user?.tag}!`)
  // List all guilds
  console.log('Guilds:')
  server.client.guilds.cache.forEach((guild) => {
    console.log(` - ${guild.name}`)
  })
  // List all commands
  console.log('Commands:')
  server.client.commands.forEach((command) => {
    console.log(` - ${(command as Command).name}`)
  })
})

// This area is for autoreplying to mentions and replies aside from '/'-commands
server.client.on('messageCreate', async (message: Message) => {
  const wasRepliedTo: boolean = message.mentions.has(server.client.user?.id ?? '')
  const doesMentionMyself: boolean = message.mentions.has(server.client.user?.toString() ?? '')
  const wasRepliedToByABot: boolean = message.author.bot
  const firstAttachment: Attachment | undefined = message.attachments.first() as Attachment

  const prompt = message.content.replace(/<@\d+> ?/g, '')
  if (message.content.startsWith('hey')) {
    await message.reply(
      [
        `Hey there! You said **${message.content}**!`,
        '',
        `Try mentioning me in a message like this: <@!${server.client.user?.id}>`,
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
        // Save the image locally
        const incomingImagePath: string[] = await saveIncomingImages(firstAttachment)

        // Generate image-to-image
        imagePaths = await imageToImage(incomingImagePath[0], prompt) // We only care about the first image
      } else {
        // Generate text-to-image
        imagePaths = await textToImage({ prompt })
      }

      const attachment = new AttachmentBuilder(imagePaths[0])
      await message.reply({ files: [attachment] })
    } catch (error) {
      console.error('Error generating image:', error)
      await message.reply(`Sorry, I encountered an error while generating the image.\n${error}`)
    }
  }
})

server.client.login(config.token)
server.client.user?.setPresence({
  activities: [
    {
      name: "Imperial Cult Painting",
      type: ActivityType.Watching,
    },
  ],
})