/**
 * @file ready event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const COLOR = require('chalk');

module.exports = async Amy => {
  try {
    if (Amy.shard && Amy.shard.id + 1 === Amy.shard.count) {
      await Amy.shard.broadcastEval('process.env.SHARDS_READY = true');
    }

    Amy.user.setPresence({
      status: Amy.config.status,
      game: {
        name: typeof Amy.config.game.name === 'string' ? Amy.config.game.name : Amy.config.game.name.length ? Amy.config.game.name[0] : null,
        type: Amy.config.game.type,
        url: Amy.config.game.url && Amy.config.game.url.trim().length ? Amy.config.game.url : null
      }
    });

    if (typeof Amy.config.game.name !== 'string' && Amy.config.game.name.length) {
      Amy.setInterval(async () => {
        try {
          await Amy.user.setActivity(Amy.config.game.name[Math.floor(Math.random() * Amy.config.game.name.length)],
            {
              type: Amy.config.game.type,
              url: Amy.config.game.url && Amy.config.game.url.trim().length ? Amy.config.game.url : null
            });
        }
        catch (e) {
          Amy.log.error(e);
        }
      }, ((typeof Amy.config.game.interval === 'number' && Amy.config.game.interval) || 60) * 60 * 1000);
    }

    let AmyGuilds = Amy.guilds.map(g => g.id);
    let guilds = await Amy.database.models.guild.findAll({
      attributes: [ 'guildID' ]
    });
    guilds = guilds.map(guild => guild.guildID);

    /*
     * Add guilds to the DB which was added Amy when it was offline.
     */
    for (let i = 0; i < AmyGuilds.length; i++) {
      let found = false;
      for (let j = 0; j < guilds.length; j++) {
        if (AmyGuilds[i] === guilds[j]) {
          found = true;
          break;
        }
      }
      if (found === false) {
        /**
         * TODO: Use <Model>.bulkCreate() when Sequelize supports bulk ignore
         * option with it, which isn't supported yet because PostgreSQL doesn't
         * support 'INSERT OR IGNORE' query, yet.
         * @example
         * await Amy.database.models.guild.bulkCreate(
         *   Amy.guilds.map(guild => {
         *     return { guildID: guild.id };
         *   }),
         *   { ignore: true }
         * );
         */
        await Amy.database.models.guild.create({
          guildID: AmyGuilds[i]
        },
        {
          fields: [ 'guildID' ]
        });
      }
    }

    /**
     * TODO: Remove guilds from DB which removed Amy when it was offline.
     * @example
     * for (let i = 0; i < guilds.length; i++) {
     *   let found = false;
     *   for (let j = 0; j < AmyGuilds.length; j++) {
     *     if (guilds[i] === AmyGuilds[j]){
     *       found = true;
     *       break;
     *     }
     *   }
     *   if (found === false) {
     *     await Amy.database.models.guild.destroy({
     *       where: {
     *         guildID: guilds[i]
     *       }
     *     });
     *   }
     * }
     */

    require('../handlers/scheduledCommandHandler')(Amy);
    require('../handlers/streamNotifier')(Amy);

    if (Amy.shard) {
      Amy.log.console(`${COLOR.cyan(`[${Amy.user.username}]:`)} Shard ${Amy.shard.id} is ready with ${Amy.guilds.size} servers.`);

      Amy.webhook.send('AmyLog', {
        title: `Launched Shard ${Amy.shard.id}`,
        description: `Shard ${Amy.shard.id} is ready with ${Amy.guilds.size} servers.`,
        footer: {
          icon_url: 'https://resources.ZoomMods.com/images/hourglass_loading.gif',
          text: `Launched ${Amy.shard.id + 1} of ${Amy.shard.count} shards.`
        },
        timestamp: new Date()
      });
    }

    if (!Amy.shard || process.env.SHARDS_READY) {
      let guilds = Amy.shard ? await Amy.shard.broadcastEval('this.guilds.size') : Amy.guilds.size;
      if (guilds instanceof Array) {
        guilds = guilds.reduce((sum, val) => sum + val, 0);
      }

      Amy.log.console(COLOR`\n{cyan Amy} v${Amy.package.version}`);
      Amy.log.console(COLOR`{gray ${Amy.package.url}}`);

      Amy.log.console(COLOR`\n{gray </> with ❤ by The Amy Bot Team & Contributors}`);
      Amy.log.console(COLOR`{gray Copyright (C) 2017-2018 The Amy Bot Project}`);

      Amy.log.console(COLOR`\n{cyan [${Amy.user.username}]:} I'm ready to roll! 🚀\n`);

      if (Amy.shard) {
        Amy.log.console(COLOR`{green [   SHARDS]:} ${Amy.shard.count}`);
      }
      Amy.log.console(COLOR`{green [  SERVERS]:} ${guilds}`);
      Amy.log.console(COLOR`{green [   PREFIX]:} ${Amy.config.prefix}`);
      Amy.log.console(COLOR`{green [ COMMANDS]:} ${Amy.commands.size}`);

      Amy.webhook.send('AmyLog', {
        color: Amy.colors.BLUE,
        title: 'I\'m Ready to Roll!  🚀',
        description: `Connected to ${guilds} servers${Amy.shard ? ` in ${Amy.shard.count} shards` : ''}.`,
        footer: {
          icon_url: 'https://resources.ZoomMods.com/logos/Amy_Logomark_C.png',
          text: `Amy v${Amy.package.version}`
        },
        timestamp: new Date()
      });
    }
  }
  catch (e) {
    Amy.log.error(e);
    process.exit(1);
  }
};
