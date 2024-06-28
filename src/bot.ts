import { Client, Intents } from "discord.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

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

client.on("guildMemberAdd", (member) => {
  const welcomeChannel = member.guild.channels.cache.find(
    (channel) => channel.name === "welcome"
  );
  if (welcomeChannel && welcomeChannel.isText()) {
    welcomeChannel.send(`Welcome to the server, ${member}!`);
  }

  const role = member.guild.roles.cache.find((role) => role.name === "Newbie");
  if (role) member.roles.add(role);
});

client.on("messageCreate", async (message) => {
  if (message.content === "!help") {
    message.channel.send("This is the help command.");

    return;
  }

  if (message.content === "!info") {
    message.channel.send("This is the info command.");

    return;
  }

  if (message.content === "!serverinfo") {
    const response = await axios.get("http://localhost:3000/api/server-info");

    const { name, memberCount, creationDate, members } = response.data;

    message.channel.send(`Server name: ${name}`);
    message.channel.send(`Member count: ${memberCount}`);
    message.channel.send(`Creation date: ${creationDate}`);
    message.channel.send(`Members: ${members.join(", ")}`);

    return;
  }

  if (message.content.startsWith("!send ")) {
    const msgContent = message.content.slice(6);
    await axios.post("http://localhost:3000/api/send-message", {
      message: msgContent,
      channelId: message.channel.id,
    });

    return;
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);

export default client;
