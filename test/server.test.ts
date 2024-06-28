import request from "supertest";
import { app, server } from "../src/server";
import { Client, Intents, TextChannel } from "discord.js";

// Mocking the Discord.js client
jest.mock("discord.js", () => {
  const actualDiscordJs = jest.requireActual("discord.js");
  const mockClient = {
    channels: {
      cache: {
        get: jest.fn().mockImplementation((id) => {
          if (id === "12345") {
            return {
              send: jest.fn().mockResolvedValue("Message sent"),
              isText: jest.fn().mockReturnValue(true),
            } as unknown as TextChannel;
          }
          return undefined;
        }),
      },
    },
    guilds: {
      cache: {
        get: jest.fn().mockReturnValue({
          name: "Test Server",
          memberCount: 2,
          createdAt: new Date(),
          members: {
            fetch: jest
              .fn()
              .mockResolvedValue([
                { user: { username: "User1" } },
                { user: { username: "User2" } },
              ]),
          },
        }),
      },
    },
    login: jest.fn(),
    once: jest.fn((event, callback) => {
      if (event === "ready") {
        callback();
      }
    }),
    user: { tag: "TestBot#0001" },
  };

  return {
    ...actualDiscordJs,
    Client: jest.fn().mockImplementation(() => mockClient),
  };
});

afterAll(() => {
  server.close();
});

describe("GET /api/server-info", () => {
  it("should return server info", async () => {
    const res = await request(app).get("/api/server-info");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("name", "Test Server");
    expect(res.body).toHaveProperty("memberCount", 2);
    expect(res.body).toHaveProperty("creationDate");
    expect(res.body).toHaveProperty("members");
    expect(res.body.members).toEqual(["User1", "User2"]);
  });
});

describe("POST /api/send-message", () => {
  it("should send a message", async () => {
    const res = await request(app)
      .post("/api/send-message")
      .send({ message: "Hello", channelId: "12345" });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("Message sent");
  });

  it("should return 400 if message or channelId is missing", async () => {
    const res = await request(app)
      .post("/api/send-message")
      .send({ message: "Hello" });
    expect(res.statusCode).toEqual(400);
  });

  it("should return 404 if channel is not found", async () => {
    const res = await request(app)
      .post("/api/send-message")
      .send({ message: "Hello", channelId: "invalidChannelId" });
    expect(res.statusCode).toEqual(404);
  });
});
