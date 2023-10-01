# Contributing to Midoridan

First off, thank you for considering contributing to Midoridan! It's people like you that make a real difference in the open source community.

## Table of Contents

- [Contributing to Midoridan](#contributing-to-midoridan)
  - [Table of Contents](#table-of-contents)
  - [Code of Conduct](#code-of-conduct)
  - [Getting Started](#getting-started)
    - [Issues](#issues)
    - [Pull Requests](#pull-requests)
  - [Setting Up the Development Environment](#setting-up-the-development-environment)
  - [Coding Guidelines](#coding-guidelines)
  - [Commit Messages](#commit-messages)
  - [License](#license)

## Code of Conduct

I think a code of conduct is unnecessary. You're probably an adult human being, I don't wanna tell you how you should behave.

## Getting Started

### Issues

- Feel free to open an issue if you find a bug or want to suggest a feature.
- Before opening a new issue, please check to make sure a similar issue isn't already open. If one is, contribute to that issue thread with your information.
- If you open an issue, please make sure to include:
  - A short, descriptive title
  - A detailed description of the issue you're encountering
  - Steps to reproduce the issue

### Pull Requests

- Fork the repository and create a new branch for your work.
- Make sure your code adheres to our coding guidelines (see below).
- Include appropriate tests if applicable.
- Open a pull request against the `main` branch of this repository.
- Your pull request should:
  - Include a detailed description
  - Reference any related issues (e.g., "Resolves #123")

## Setting Up the Development Environment

1. Fork the repository to your GitHub account.
2. Clone your fork locally: `git clone https://github.com/your-username/Midoridan.git`
3. Install the required dependencies: `npm install`
4. Make your changes in a new git branch: `git checkout -b my-fix-branch main`

## Coding Guidelines

- Follow the coding style defined in our ESLint and Prettier configurations.
- Include comments explaining the reasoning behind any non-intuitive decisions you've made. I kept the comments very sparse in the belief that for now the code reads itself. Ideally you have the same belief.
- If you contribute to writing tests, that would be based af. So far I've only manually tested it to make sure it works as intended.

## Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or fewer but it's not a strict guideline to me.
- Reference issues and pull requests liberally after the first line

## License

By contributing, you agree that your contributions will be licensed under the project's GPLv3.0+ license.