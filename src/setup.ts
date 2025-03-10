// File: src/setup.ts

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
import { REST } from '@discordjs/rest'
import { ActivityType, Routes } from 'discord-api-types/v10'
import { Client, Collection, SlashCommandBuilder } from 'discord.js'
import fs from 'fs'
import path from 'path'
import config from './config'
import { ClientWithCommands, Command } from './types'
const TOKEN = config.token
const VERBOSE = config.verbose

//#region Intents
const IntentBits = {
  GUILDS: 1 << 0,
  GUILD_MEMBERS: 1 << 1,
  GUILD_BANS: 1 << 2,
  GUILD_EMOJIS_AND_STICKERS: 1 << 3,
  GUILD_INTEGRATIONS: 1 << 4,
  GUILD_WEBHOOKS: 1 << 5,
  GUILD_INVITES: 1 << 6,
  GUILD_VOICE_STATES: 1 << 7,
  GUILD_PRESENCES: 1 << 8,
  GUILD_MESSAGES: 1 << 9,
  GUILD_MESSAGE_REACTIONS: 1 << 10,
  GUILD_MESSAGE_TYPING: 1 << 11,
  DIRECT_MESSAGES: 1 << 12,
  DIRECT_MESSAGE_REACTIONS: 1 << 13,
  DIRECT_MESSAGE_TYPING: 1 << 14,
  MESSAGE_CONTENT: 1 << 15,
  GUILD_SCHEDULED_EVENTS: 1 << 16,
  AUTO_MODERATION_CONFIGURATION: 1 << 20,
  AUTO_MODERATION_EXECUTION: 1 << 21,
}

const intents = Object.values(IntentBits).reduce((a, b) => a | b, 0)
//#endregion

//#region REST + CLIENT API + INTENTS + COMMANDS
const rest = new REST({ version: '10' }).setToken(TOKEN ?? '')

const client = new Client({
  intents: intents,
}) as ClientWithCommands

client.commands = new Collection()

// Asynchronously load all command files and return them as an array of Commands
const loadCommands = async (): Promise<Command[]> => {
  const commandFiles = fs
    .readdirSync(path.join(__dirname, './commands'))
    .filter((file) => file.endsWith('.ts') || file.endsWith('.js'))

  const commandPromises = commandFiles.map(async (file) => {
    if (VERBOSE) console.log(`Loading command ${file}... :`)
    const commandModule = await import(path.join(__dirname, `./commands/${file}`))
    const command: Command = {
      ...commandModule,
      name: commandModule.name,
      description: commandModule.description,
      execute: commandModule.execute,
    }
    if (VERBOSE) console.dir(command)
    client.commands.set(command.name, command)
    if (VERBOSE) console.log(`Loaded command ${command.name}.`)
    return command
  })

  return Promise.all(commandPromises)
}

// Function to load commands and set up slash commands
const getBuiltCommands = async (): Promise<Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>[]> => {
  const commandArray = await loadCommands()
  return commandArray.map((element) => {
    const newCommand = new SlashCommandBuilder().setName(element.name).setDescription(element.description)

    if (element.name !== 'help') {
      newCommand.addStringOption((option) =>
        option.setName('prompt').setDescription(element.description).setRequired(true),
      )
    }

    return newCommand
  })
}

// Main function to refresh application commands
const refreshApplicationCommands = async () => {
  try {
    console.log(`Started refreshing application (/) commands.`)
    const commandsToRegisterWithDiscord = await getBuiltCommands()
    await rest.put(Routes.applicationCommands(config.clientId ?? ''), {
      body: commandsToRegisterWithDiscord,
    })
    console.log(`Successfully reloaded application (/) commands.`)
  } catch (error) {
    console.error(error)
  }
}

// Register commands by sending them over to discord
refreshApplicationCommands()
//#endregion

//#region command handling
// Add this block to handle the interactionCreate event
client.on('interactionCreate', async (interaction) => {
  // if the interaction is not a command or if it was initiated by another bot, return
  if (!interaction.isCommand() || interaction.user.bot) return

  const { commandName } = interaction

  // Retrieve the command from the Collection by its name
  const cmd = client.commands.get(commandName) as Command

  // If the command exists, execute it
  if (cmd) {
    cmd.execute(interaction)
  } else {
    // Optional: Send a message if the command does not exist
    await interaction.reply(`Unknown command: ${commandName}`)
  }
})

//#endregion

client.user?.setPresence({
  activities: [
    {
      name: 'Imperial Cult Painting',
      type: ActivityType.Watching,
    },
  ],
})
export default {
  client: client,
  rest: rest,
}
