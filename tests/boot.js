/**
 * @file Test script to test Amy's successful booting
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

Amy.package = require('../package.json');
Amy.credentials = require('../settings/credentials.json');
Amy.config = require('../settings/config.json');
Amy.Constants = Discord.Constants;
Amy.colors = Discord.Constants.Colors;
Amy.permissions = Discord.Permissions.FLAGS;

// require('./utils/Array.prototype');
require('../utils/String.prototype');
require('../utils/Number.prototype');

const WebhookHandler = require('../handlers/webhookHandler.js');
Amy.webhook = new WebhookHandler(Amy.credentials.webhooks);
Amy.log = require('../handlers/logHandler');
Amy.functions = require('../handlers/functionHandler');
const LanguageHandler = require('../handlers/languageHandler');
Amy.strings = new LanguageHandler();

const Sequelize = require('sequelize');
Amy.database = new Sequelize(Amy.credentials.database.URI, {
  operatorsAliases: false,
  logging: false
});
Amy.database.authenticate().then(() => {
  // Populate Database/Implement model definitions
  require('../utils/models')(Sequelize, Amy.database);

  // Load Amy Database (Depricated)
  // Will be removed once new database is completely implemented
  Amy.db = require('sqlite');
  Amy.db.open('./data/Amy.sqlite').then(db => {
    db.run('PRAGMA foreign_keys = ON');
    require('../utils/populateDatabase')(Amy.db);
  }).catch(e => {
    Amy.log.error(e.stack);
    process.exit(1);
  });

  // Load Amy Events
  require('../handlers/eventHandler')(Amy);

  // Load Amy Modules
  const Modules = require('../handlers/moduleHandler');
  Amy.commands = Modules.commands;
  Amy.aliases = Modules.aliases;

  if (Amy.commands && Amy.aliases) {
    Amy.log.info(`Successfully loaded ${Amy.commands.size} commands`);
  }
  else {
    Amy.log.error('Failed to load commands.');
    process.exit(1);
  }
}).catch(e => {
  Amy.log.error(e.stack);
  process.exit(1);
});
