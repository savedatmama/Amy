/**
 * @file The starting point of Amy
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const Discord = require('discord.js');
const Amy = new Discord.Client({
  disabledEvents: [
    'USER_NOTE_UPDATE',
    'TYPING_START',
    'RELATIONSHIP_ADD',
    'RELATIONSHIP_REMOVE'
  ]
});

if (Amy.shard) {
  process.title = `Amy-Shard-${Amy.shard.id}`;
}
else {
  process.title = 'AmyBot';
}

Amy.package = require('./package.json');
Amy.credentials = require('./settings/credentials.json');
Amy.config = require('./settings/config.json');
Amy.Constants = Discord.Constants;
Amy.colors = Discord.Constants.Colors;
Amy.permissions = Discord.Permissions.FLAGS;

// require('./utils/Array.prototype');
require('./utils/String.prototype');
require('./utils/Number.prototype');

const WebhookHandler = require('./handlers/webhookHandler.js');
Amy.webhook = new WebhookHandler(Amy.credentials.webhooks);
Amy.log = require('./handlers/logHandler');
Amy.functions = require('./handlers/functionHandler');
const LanguageHandler = require('./handlers/languageHandler');
Amy.strings = new LanguageHandler();

const Sequelize = require('sequelize');
Amy.database = new Sequelize(Amy.credentials.database.URI, {
  operatorsAliases: false,
  logging: false
});
Amy.database.authenticate().then(() => {
  // Populate Database/Implement model definitions
  require('./utils/models')(Sequelize, Amy.database);

  // Load Amy Database (Depricated)
  // Will be removed once new database is completely implemented
  Amy.db = require('sqlite');
  Amy.db.open('./data/Amy.sqlite').then(db => {
    db.run('PRAGMA foreign_keys = ON');
    require('./utils/populateDatabase')(Amy.db);
  });

  // Load Amy Events
  require('./handlers/eventHandler')(Amy);

  // Load Amy Modules
  const Modules = require('./handlers/moduleHandler');
  Amy.commands = Modules.commands;
  Amy.aliases = Modules.aliases;

  // Start Amy
  Amy.login(Amy.credentials.token).then(() => {
    /**
     * Using <Model>.findOrCreate() won't require the use of
     * <ModelInstance>.save() but <Model>.findOrBuild() is used instead because
     * <Model>.findOrCreate() creates a race condition where a matching row is
     * created by another connection after the `find` but before the `insert`
     * call. However, it is not always possible to handle this case in SQLite,
     * specifically if one transaction inserts and another tries to select
     * before the first one has committed. TimeoutError is thrown instead.
     */
    Amy.database.models.settings.findOrBuild({
      where: {
        botID: Amy.user.id
      }
    }).spread((settingsModel, initialized) => {
      if (initialized) {
        return settingsModel.save();
      }
    }).catch(Amy.log.error);
  }).catch(e => {
    Amy.log.error(e.toString());
    process.exit(1);
  });
}).catch(err => {
  Amy.log.error(err);
});

process.on('unhandledRejection', rejection => {
  // eslint-disable-next-line no-console
  console.warn(`\n[unhandledRejection]\n${rejection}\n[/unhandledRejection]\n`);
});
client.login(process.env.BOT_TOKEN);
