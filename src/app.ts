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

import config from './config'
import fs from 'fs'
import server from './setup'
import { AttachmentBuilder, Message } from 'discord.js'
import { TextToImageRequestBody, TextToImageResponseBody } from './types'

server.client.once('ready', async () => {
  console.log(`Logged in as ${server.client.user?.tag}!`)
  // List all guilds
  console.log('Guilds:')
  server.client.guilds.cache.forEach((guild) => {
    console.log(` - ${guild.name}`)
  })
})

const createHeaders = () => ({
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: `Bearer ${config.stableDiffusionApiKey}`,
})

const createRequestBody = (prompt: string): TextToImageRequestBody => ({
  steps: 40,
  width: 512,
  height: 512,
  seed: 0,
  cfg_scale: 5,
  samples: 1,
  text_prompts: [
    {
      text: prompt,
      weight: 1,
    },
    {
      text: 'blurry, bad',
      weight: -1,
    },
  ],
})

const handleErrorResponse = async (response: Response) => {
  const errorMessage = `\`${response.statusText}\`\nWeb status code response from stability.ai api: \`${response.status}\``
  console.log(errorMessage)
  throw new Error(errorMessage)
}

const saveImages = (responseJSON: TextToImageResponseBody): string[] => {
  const paths: string[] = []
  responseJSON.artifacts.forEach((image: { seed: number; base64: string }) => {
    const path = `./images/out/txt2img_${image.seed}.png`
    paths.push(path)
    fs.writeFileSync(path, Buffer.from(image.base64, 'base64'))
  })
  return paths
}

const textToImage = async (prompt: string): Promise<string[]> => {
  const headers = createHeaders()
  const body = createRequestBody(prompt)

  const response = await fetch(config.textToImageApiUrl ?? '', {
    headers,
    method: 'POST',
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    await handleErrorResponse(response)
  }

  const responseJSON: TextToImageResponseBody = await response.json()
  return saveImages(responseJSON)
}

server.client.on('messageCreate', async (message: Message) => {
  const wasRepliedTo: boolean = message.mentions.has(server.client.user?.id ?? '')
  const doesMentionMyself: boolean = message.mentions.has(server.client.user?.toString() ?? '')
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
  if (doesMentionMyself || wasRepliedTo) {
    try {
      const firstPost = `Generating image for ${message.author.displayName}: \`${prompt}\`...`
      console.log(firstPost)
      await message.reply(`${firstPost}`)
      const imagePaths = await textToImage(prompt)
      const attachment = new AttachmentBuilder(imagePaths[0])
      await message.reply({ files: [attachment] })
    } catch (error) {
      console.error('Error generating image:', error)
      await message.reply(`Sorry, I encountered an error while generating the image.\n${error}`)
    }
  }
})

server.client.login(config.token) // Replace with your bot token
