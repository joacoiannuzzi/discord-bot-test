# Discord Bot with Node.js Server

This project integrates a Discord bot with a Node.js server, providing endpoints to fetch Discord server information and manage message sending.

## Features

- Automatically greet new members upon joining.
- Automatically assign a role upon joining.
- Respond to custom text commands like `!help` and `!info`.
- Fetch basic Discord server information via an API endpoint.
- Send messages to a specific Discord channel via an API endpoint.

## Setup

### Prerequisites

- Node.js installed on your machine.
- A Discord bot created in the [Discord Developer Portal](https://discord.com/developers/applications).
- The Discord bot token and server ID.

### Installation

1. Clone the repository:

```bash
git clone https://github.com/joacoiannuzzi/discord-bot-test.git
cd discord-bot-test
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add your Discord bot token and server ID:

```env
DISCORD_BOT_TOKEN=YOUR_DISCORD_BOT_TOKEN
SERVER_ID=YOUR_SERVER_ID
```

### Running the Server and Bot

Start the server and bot using the following command:

```bash
npm run dev-all
```

## Endpoints

### Fetch Server Information

- **GET /api/server-info**: Fetch basic Discord server information.

Example request:

```bash
curl -X GET http://localhost:3000/api/server-info
```

Example response:

```json
{
  "name": "Your Server Name",
  "memberCount": 150,
  "creationDate": "2020-01-01T00:00:00.000Z",
  "members": ["User1", "User2", "User3"]
}
```

### Send Message to a Channel

- **POST /api/send-message**: Send a message to a specific Discord channel.

Example request:

```bash
curl -X POST http://localhost:3000/api/send-message \
 -H "Content-Type: application/json" \
 -d '{
"message": "Hello, world!",
"channelId": "123456789012345678"
}'
```

Request body:

```json
{
  "message": "Hello, world!",
  "channelId": "123456789012345678"
}
```

## Bot Commands

- **!help**: Responds with a help message.
- **!info**: Responds with an info message.

## Testing

Run tests using Jest:

```bash
npm test
```

### Test Coverage

The project includes tests for:

- Bot command responses.
- API endpoints for fetching server information and sending messages.
