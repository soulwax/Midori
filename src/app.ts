// initialize discord REST

import config from './config'

import server from './setup'
import axios from 'axios'
import { AttachmentBuilder, Message } from 'discord.js'
import dotenv from 'dotenv'
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
  //     (channel) => channel?.id === '1135408229329944579',
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

server.client.on('messageCreate', async (message: Message) => {
  const wasMentioned: boolean = message.mentions.has(server.client.user?.id ?? '')
  console.log(`wasMentioned: ${wasMentioned}`)
  const mentionedHas = server.client.user?.toString() ?? ''
  console.log(`mentionedHas: ${mentionedHas}`)
  if (message.content.startsWith('hey')) {
    await message.reply(
      [
        `Hey there! You said **${message.content}**!`,
        '',
        `This is an example handler that responds to messages starting with "hey"`,
      ].join('\n'),
    )
  }
  if (message.mentions.has(server.client.user?.toString() ?? '') || wasMentioned) {
    try {
      const response = await axios.get('https://dreamstudio.ai/api/endpoint', {
        responseType: 'arraybuffer', // To handle binary data
      })
      // Convert the binary data to a Discord attachment
      const attachment = new AttachmentBuilder(response.data, { name: 'image.png' }) // Assuming the image is a PNG, adjust the filename accordingly
      console.log(`=== data from dreamstudio.ai ===`)
      console.dir(response.data)
      // Send the image to the channel, mentioning the user and reiterating their prompt
      await message.channel.send({
        content: `<@${message.author.id}> Generated image for: "${message.content}"`,
        files: [attachment],
      })
    } catch (error) {
      console.error('Error fetching image from dreamstudio.ai:', error)
      await message.reply('Sorry, I encountered an error while fetching the image.')
    }
  }
})

server.client.login(config.token) // Replace with your bot token
