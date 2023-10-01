# Midoridan

## Overview

Midoridan is a Discord bot developed using TypeScript and Discord.js. Currently, the bot offers a greeting message and can send messages to the Stable Diffusion API when prompted. The primary functionality includes generating and posting images to Discord.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Code Structure](#code-structure)
- [Coding Standards](#coding-standards)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
  - [Commands](#commands)
- [Configuration](#configuration)
- [Development](#development)
  - [Linting](#linting)
  - [Formatting](#formatting)
  - [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Message Diffusion**: Utilizes the Stable Diffusion API to send messages.
- **Automated Responses**: Automatically responds to specific triggers in Discord messages.
- **Customizable**: Configurable via environment variables (see [Configuration](#configuration)).

## Code Structure

- [`src/app.ts`](https://github.com/soulwax/Midoridan/blob/main/src/app.ts): Main application file that initializes the bot.
- [`src/setup.ts`](https://github.com/soulwax/Midoridan/blob/main/src/setup.ts): Sets up the Discord client and REST API.
- [`src/commands/diffuse.ts`](https://github.com/soulwax/Midoridan/blob/main/src/commands/diffuse.ts): Handles the `diffuse` command (planned feature).

## Coding Standards

- ESLint: Follow the rules defined in the [configuration file](https://github.com/soulwax/Midoridan/blob/main/.eslintrc.js).
- Prettier: Code formatting is handled by [Prettier](https://github.com/soulwax/Midoridan/blob/main/.prettierrc).

## Prerequisites

- Node.js (version x.x.x or higher)
- npm (version x.x.x or higher)

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
  - `API_KEY`: Your API key for Stable Diffusion API.
  - `DISCORD_TOKEN`: Your Discord bot token.

## Development

### Linting

This project uses ESLint for linting. To run the linter, execute:

```bash
npm run lint
```

### Formatting

This project uses Prettier for code formatting. To format the code, execute:

```bash
npm run format
```

### Testing

(Include any testing procedures if applicable)

## Contributing

Feel free to open issues and pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the GPL-3.0 License.