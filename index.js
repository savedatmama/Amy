const Discord = require('discord.js');
const credentials = require('./settings/credentials.json');
const config = require('./settings/config.json');
const Manager = new Discord.ShardingManager('./Amy.js', {
  totalShards: config.shardCount,
  token: credentials.token
});
const log = require('./handlers/logHandler');

Manager.spawn();

Manager.on('launch', shard => {
  log.info(`Launching Shard ${shard.id} [ ${shard.id + 1} of ${Manager.totalShards} ]`);
});
