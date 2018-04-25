/**
 * @file scheduledCommandHandler
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const CronJob = require('cron').CronJob;
const parseArgs = require('command-line-args');

/**
 * Handles Amy's scheduled commands
 * @param {Amy} Amy Amy Discord client object
 * @returns {void}
 */
module.exports = Amy => {
  setTimeout(async () => {
    try {
      let scheduledCommandModel = await Amy.database.models.scheduledCommand.findAll({
        attributes: [ 'channelID', 'messageID', 'cronExp', 'command', 'arguments' ]
      });

      if (!scheduledCommandModel.length) return;

      for (let i = 0; i < scheduledCommandModel.length; i++) {
        let cronExp = scheduledCommandModel[i].dataValues.cronExp,
          command = scheduledCommandModel[i].dataValues.command.toLowerCase(), cmd,
          channel = Amy.channels.get(scheduledCommandModel[i].dataValues.channelID);
        if (!channel) {
          removeScheduledCommandByChannelID(Amy, scheduledCommandModel[i].dataValues.channelID);
          continue;
        }
        let args = scheduledCommandModel[i].dataValues.arguments ? scheduledCommandModel[i].dataValues.arguments.split(' ') : '';

        let job = new CronJob(cronExp,
          async function () {
            let message = await channel.fetchMessage(scheduledCommandModel[i].dataValues.messageID).catch(e => {
              if (e.toString().includes('Unknown Message')) {
                job.stop();
                removeScheduledCommandByMessageID(Amy, scheduledCommandModel[i].dataValues.messageID);
              }
              else {
                Amy.log.error(e);
              }
            });

            if (Amy.commands.has(command)) {
              cmd = Amy.commands.get(command);
            }
            else if (Amy.aliases.has(command)) {
              cmd = Amy.commands.get(Amy.aliases.get(command).toLowerCase());
            }
            else {
              job.stop();
              return removeScheduledCommandByCommandName(Amy, command);
            }

            if (cmd.config.enabled) {
              cmd.exec(Amy, message, parseArgs(cmd.config.argsDefinitions, { argv: args, partial: true }));
            }
          },
          function () {},
          false // Start the job right now
        );
        job.start();
      }
    }
    catch (e) {
      Amy.log.error(e);
    }
  }, 5 * 1000);
};

/**
 * Removes Amy's scheduled commands
 * @param {Amy} Amy Amy Discord client object
 * @param {String} channelID The Snowflake ID of the channel where the command is scheduled
 * @returns {void}
 */
function removeScheduledCommandByChannelID(Amy, channelID) {
  Amy.database.models.scheduledCommand.destroy({
    where: {
      channelID: channelID
    }
  }).catch(e => {
    Amy.log.error(e);
  });
}

/**
 * Removes Amy's scheduled commands
 * @param {Amy} Amy Amy Discord client object
 * @param {String} messageID The Snowflake ID of the message that holds the scheduled command's info
 * @returns {void}
 */
function removeScheduledCommandByMessageID(Amy, messageID) {
  Amy.database.models.scheduledCommand.destroy({
    where: {
      messageID: messageID
    }
  }).catch(e => {
    Amy.log.error(e);
  });
}

/**
 * Removes Amy's scheduled commands
 * @param {Amy} Amy Amy Discord client object
 * @param {String} commandName The name of the command that is scheduled
 * @returns {void}
 */
function removeScheduledCommandByCommandName(Amy, commandName) {
  Amy.database.models.scheduledCommand.destroy({
    where: {
      command: commandName
    }
  }).catch(e => {
    Amy.log.error(e);
  });
}
