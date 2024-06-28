import express, { Request, Response } from "express";
import { Client, Intents, Guild } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.MESSAGE_CONTENT,
  ],
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.login(process.env.DISCORD_BOT_TOKEN);

app.use(express.json());

app.get("/api/server-info", async (req: Request, res: Response) => {
  try {
    const serverId = process.env.SERVER_ID as string;
    const guild: Guild | undefined = client.guilds.cache.get(serverId);

    if (!guild) {
      return res.status(404).send("Server not found");
    }

    const members = await guild.members.fetch();
    const memberNames = members.map((member) => member.user.username);

    const serverInfo = {
      name: guild.name,
      memberCount: guild.memberCount,
      creationDate: guild.createdAt,
      members: memberNames,
    };

    res.json(serverInfo);
  } catch (error) {
    console.error("Error fetching server info:", error);
    res.status(500).send("Error fetching server info");
  }
});

app.post("/api/send-message", async (req: Request, res: Response) => {
  const { message, channelId } = req.body;

  if (!message || !channelId) {
    return res.status(400).send("Missing message or channelId");
  }

  try {
    const channel = client.channels.cache.get(channelId);
    if (!channel) {
      return res.status(404).send("Channel not found");
    }

    if (!channel.isText()) {
      return res.status(400).send("Channel is not a text channel");
    }

    await channel.send(message);
    res.status(200).send("Message sent");
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).send("Error sending message");
  }
});

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export { server, app };
