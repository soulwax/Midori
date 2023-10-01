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
import dotenv from 'dotenv'
import { TextToImageRequestBody, TextToImageResponseBody } from './types'
dotenv.config()

server.client.once('ready', async () => {
  console.log(`Logged in as ${server.client.user?.tag}!`)

  // Code from deployed.js
  // const guilds = await server.client.guilds.fetch();
  // const firstGuild = guilds.first();
  // if (firstGuild) {
  //   const guild = firstGuild as unknown as Discord.Guild;
  //   const channels = await guild.channels.fetch();
  //   const generalChannel: TextChannel = channels.find(
  //     (channel) => channel?.id === 'process.env.GENERAL_CHANNEL_ID',
  //   ) as TextChannel;
  //   // if (generalChannel) {
  //   //   await generalChannel.send(
  //   //     [
  //   //       `Hey there! Thanks for installing this Discord bot.`,
  //   //       `Try mentioning me in a message like this: <@!${server.client.user?.id}>`,
  //   //       '',
  //   //       `You can support our codebase here:`,
  //   //       `https://github.com/soulwax/Midoridan`,
  //   //     ].join('\n'),
  //   //   );
  //   // }
  // }
})

const STABLE_DIFFUSION_API_KEY = process.env.STABLE_DIFFUSION_API_KEY

export const textToImage = async (prompt: string): Promise<string[]> => {
  const path = 'https://api.stability.ai/v1/generation/stable-diffusion-512-v2-1/text-to-image'

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${STABLE_DIFFUSION_API_KEY}`,
  }

  const body: TextToImageRequestBody = {
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
  }

  const response: Promise<Response> = fetch(path, {
    headers,
    method: 'POST',
    body: JSON.stringify(body),
  })

  if ((await response).ok === false) {
    throw new Error('Failed to generate image.')
  }

  const responseJSON: TextToImageResponseBody = await (await response).json()

  const paths: string[] = []
  responseJSON.artifacts.forEach((image: { seed: number; base64: string }) => {
    const path = `./images/out/txt2img_${image.seed}.png`
    paths.push(path)
    fs.writeFileSync(path, Buffer.from(image.base64, 'base64'))
  })

  return paths
}

server.client.on('messageCreate', async (message: Message) => {
  const wasRepliedTo: boolean = message.mentions.has(server.client.user?.id ?? '')
  const doesMentionMyself: boolean  = message.mentions.has(server.client.user?.toString() ?? '')
  const prompt = message.content.replace(/<@\d+> ?/g, "")
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
      await message.reply(`Generating image for ${message.author.displayName}: \`${prompt}\`...`)
      const imagePaths = await textToImage(prompt)
      const attachment = new AttachmentBuilder(imagePaths[0])
      await message.reply({ files: [attachment] })
    } catch (error) {
      console.error('Error generating image:', error)
      await message.reply(`Sorry, I encountered an error while generating the image. Reason: ${error}`)
    }
  }
})

server.client.login(config.token) // Replace with your bot token
