import { Message } from "discord.js";
import { jest } from "@jest/globals";
import client from "../src/bot"; // Ensure you have client exported from your bot file

test("Bot should respond to !help command", (done) => {
  const message = {
    content: "!help",
    channel: { send: jest.fn() },
  } as unknown as Message;

  client.emit("messageCreate", message);
  process.nextTick(() => {
    expect(message.channel.send).toHaveBeenCalledWith(
      "This is the help command."
    );
    done();
  });
});

test("Bot should respond to !info command", (done) => {
  const message = {
    content: "!info",
    channel: { send: jest.fn() },
  } as unknown as Message;

  client.emit("messageCreate", message);
  process.nextTick(() => {
    expect(message.channel.send).toHaveBeenCalledWith(
      "This is the info command."
    );
    done();
  });
});
