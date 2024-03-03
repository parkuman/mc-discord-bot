require("dotenv").config({ path: "/opt/minecraft/mc-discord-bot/.env" });
const { Client, GatewayIntentBits, ActivityType } = require("discord.js");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
console.log(process.env)

async function fetchServerInfo(ip) {
  const res = await fetch(`https://mcapi.us/server/status?ip=${ip}`);

  if (res.ok) {
    const resJson = await res.json();
    // console.log(resJson.players);

    return resJson.players;
  } else {
    console.error("ERROR FETCHING SERVER STATUS");
  }
}

function runBot() {}

client.once("ready", async () => {
  console.log("Discord Bot Ready!");

  runBot();
});

client.login(process.env.DISCORD_TOKEN);

setInterval(async () => {
  console.log("Checking MC Server Status:");
  const playerInfo = await fetchServerInfo(process.env.IP);

  let players = "";
  if (playerInfo.now != 0) {
    players = playerInfo.sample.map((player) => ` ${player.name}`);
  }
  const time = new Date().toDateString();
  console.log(time, `Players: ${playerInfo.now}/${playerInfo.max}`, players);

  client.user.setPresence({
    activities: [
      {
        name: `${playerInfo.now}/${playerInfo.max}: ${players}`,
        type: ActivityType.Playing,
      },
    ],
  });
}, 60000); // 1 minute
