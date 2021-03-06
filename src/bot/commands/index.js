const Discord = require("discord.js");
const { client } = require("../client");
const { sendMsg } = require("../utils/sendMsg");
const { commandList, prefix } = require("../../../config.json");

client.commands = new Discord.Collection();

commandList.forEach((commandName) => {
  const command = require(`./${commandName}`);
  client.commands.set(command.name, command);
});

client.on("message", async (msg) => {
  const args = msg.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift();

  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);

  if (args.length !== command.numArgs) {
    if (command.numArgs === 0) {
      sendMsg(`That command takes no arguments`);
    } else if (command.numArgs === 1) {
      sendMsg(`Please provide ${command.numArgs} argument`);
    } else {
      sendMsg(`Please provide ${command.numArgs} arguments`);
    }

    return;
  }

  try {
    command.execute(msg, args);
  } catch (error) {
    console.log(error.message);
    await sendMsg("Error");
  }
});
