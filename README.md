# Midoridan

![GitHub license](https://img.shields.io/github/license/soulwax/Midoridan)
![GitHub stars](https://img.shields.io/github/stars/soulwax/Midoridan)
![GitHub issues](https://img.shields.io/github/issues/soulwax/Midoridan)
![GitHub forks](https://img.shields.io/github/forks/soulwax/Midoridan)
![Node.js Version](https://img.shields.io/node/v/discord.js)
![TypeScript Version](https://img.shields.io/npm/types/typescript)

## Overview

Midoridan is a Discord bot developed using TypeScript and Discord.js. Currently, the bot offers a greeting message and can send messages to the Stable Diffusion API when prompted. The primary functionality includes generating and posting images to Discord.

## Table of Contents

- [Midoridan](#midoridan)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Requirements](#requirements)
  - [Environment Variables](#environment-variables)
  - [Features](#features)
  - [Commands](#commands)
  - [Code Structure](#code-structure)
  - [Coding Standards](#coding-standards)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Commands](#commands-1)
  - [Configuration](#configuration)
  - [Development](#development)
    - [Typescript Watch, Debugging and Linting](#typescript-watch-debugging-and-linting)
    - [Formatting](#formatting)
    - [Testing](#testing)
  - [Contributing](#contributing)
  - [License](#license)

## Requirements

- Node.js
- TypeScript

## Environment Variables

You'll need to set up some environment variables for the bot to work correctly. An example `.env-sample` file is provided in the repository.

1. Create a discord bot at the [Discord Developer Portal](https://discord.com/developers/applications).
2. Create an account at [Stable Diffusion](https://platform.stability.ai/).
3. Grab your Discord client ID and secret and your bot token and add them to the `.env` file.
4. Grab your Stable Diffusion API key and add it to the `.env` file.
5. Adjust the links if needed (e.g. if you want to use a different API version) but as of October 2023, the links are very up to date.

You should be good to go. Further details on the configuration can be found in the [Configuration](#configuration) section.

## Features

- **Diffuse**: A feature that allows you to generate images from text and post them to Discord using the Stable Diffusion API.
- **Help**: Provides help documentation for the bot's commands.
- **Setup**: Sets up the bot for your server.
- **Utils**: Various utility functions to make life easier for the developer.

## Commands

- `/diffuse [options]`: Uses the Stable Diffusion API to convert text to an image and post it to the current channel.
- `/help`: Shows the currently implemented functions.

## Code Structure

- [`src/app.ts`](https://github.com/soulwax/Midoridan/blob/main/src/app.ts): Main application file that initializes the bot.
- [`src/setup.ts`](https://github.com/soulwax/Midoridan/blob/main/src/setup.ts): Sets up the Discord client and REST API.
- [`src/commands/diffuse.ts`](https://github.com/soulwax/Midoridan/blob/main/src/commands/diffuse.ts): Handles the `diffuse` command (planned feature).

## Coding Standards

- ESLint: Follow the rules defined in the [configuration file](https://github.com/soulwax/Midoridan/blob/main/.eslintrc.js).
- Prettier: Code formatting is handled by [Prettier](https://github.com/soulwax/Midoridan/blob/main/.prettierrc).

## Prerequisites

- Node.js (version 18.18.x or higher)
- npm (version 9.8.0 or higher)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/soulwax/Midoridan.git
```

2. Navigate to the project directory:

```bash
cd Midoridan
```

3. Install dependencies:

```bash
npm install
```

## Usage

To run the application, execute:

```bash
npm start
```

### Commands

- `diffuse`: (Planned feature) This command will allow you to send a message to the Stable Diffusion API.

## Configuration

1. Copy `.env-sample` to `.env`:

```bash
cp .env-sample .env
```

2. Edit `.env` to include your specific configuration. The following environment variables can be set:

- `DISCORD_CLIENT_ID`: Your Discord client ID.
- `DISCORD_CLIENT_SECRET`: Your Discord client secret.
- `DISCORD_TOKEN`: Your Discord bot token.
- `STABLE_DIFFUSION_API_KEY`: Your API key for Stable Diffusion API.
- `GENERAL_CHANNEL_ID`: Currently unused but one could limit the bot to post only there.
- `TEXT_TO_IMAGE_API_URL`: The URL of the Stable Diffusion API for Text to Image.
- `IMAGE_TO_IMAGE_API_URL`: The URL of the Stable Diffusion API for Image to Image.

## Development

### Typescript Watch, Debugging and Linting

This project uses ESLint for linting. To run the linter, execute:

```bash
npm run lint
```

During development, you should run `npm run watch` to compile on the fly while you're working on the code.

Provided the correct use of the .vscode/launch.json file, you can debug the code and react to changes immediately while watching is running, without having to restart the bot all the time. This is especially useful when working on the bot's commands.

### Formatting

This project uses Prettier for code formatting. To format the code, execute:
Current rules can be seen in the [.prettierrc](.prettierrc) file.

### Testing

The project is currently tested manually. Automated testing will be implemented in the future. Pull requests are welcome.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

## License

This project is licensed under the GPL-3.0 License.
