/**
 * @file Event Handler
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

/**
 * Loads the events
 * @function LOAD_EVENTS
 * @param {string} event Name of the event.
 * @returns {function} The event's function.
 */
const LOAD_EVENTS = event => require(`../events/${event}`);

/**
 * Handles/Loads all the events.
 * @module eventHandler
 * @param {object} Amy The Amy Object.
 * @returns {void}
 */
module.exports = Amy => {
  /**
   * Emitted whenever a channel is created.
   * @listens channelCreate
   */
  Amy.on('channelCreate', LOAD_EVENTS('channelCreate'));
  /**
   * Emitted whenever a channel is deleted.
   * @listens channelDelete
   */
  Amy.on('channelDelete', LOAD_EVENTS('channelDelete'));
  /**
   * Emitted whenever a channel is updated - e.g. name change, topic change.
   * @listens channelUpdate
   */
  Amy.on('channelUpdate', LOAD_EVENTS('channelUpdate'));
  /**
   * Emitted whenever Amy's WebSocket encounters a connection error.
   * Also handles other errors emitted by Amy.
   * @listens error
   */
  Amy.on('error', LOAD_EVENTS('error'));
  /**
   * Emitted whenever a member is banned from a guild.
   * @listens guildBanAdd
   */
  Amy.on('guildBanAdd', LOAD_EVENTS('guildBanAdd'));
  /**
   * Emitted whenever a member is unbanned from a guild.
   * @listens guildBanRemove
   */
  Amy.on('guildBanRemove', LOAD_EVENTS('guildBanRemove'));
  /**
   * Emitted whenever Amy joins a guild.
   * @listens guildCreate
   */
  Amy.on('guildCreate', LOAD_EVENTS('guildCreate'));
  /**
   * Emitted whenever a guild is deleted/left.
   * @listens guildDelete
   */
  Amy.on('guildDelete', LOAD_EVENTS('guildDelete'));
  /**
   * Emitted whenever a user joins a guild.
   * @listens guildMemberAdd
   */
  Amy.on('guildMemberAdd', LOAD_EVENTS('guildMemberAdd'));
  /**
   * Emitted whenever a member leaves a guild, or is kicked.
   * @listens guildMemberRemove
   */
  Amy.on('guildMemberRemove', LOAD_EVENTS('guildMemberRemove'));
  /**
   * Emitted whenever a member leaves a guild, or is kicked.
   * @listens guildMemberRemove
   */
  Amy.on('presenceUpdate', LOAD_EVENTS('presenceUpdate'));
  /**
   * Emitted whenever a guild is updated - e.g. name change.
   * @listens guildUpdate
   */
  Amy.on('guildUpdate', LOAD_EVENTS('guildUpdate'));
  /**
   * Emitted whenever a message is created.
   * @listens message
   */
  Amy.on('message', LOAD_EVENTS('message'));
  /**
   * Emitted whenever a reaction is added to a message.
   * @listens message
   */
  Amy.on('messageReactionAdd', LOAD_EVENTS('messageReactionAdd'));
  /**
   * Emitted whenever a message is updated - e.g. embed or content change.
   * @listens messageUpdate
   */
  Amy.on('messageUpdate', LOAD_EVENTS('messageUpdate'));
  /**
   * Emitted when Amy becomes ready to start working.
   * @listens ready
   */
  Amy.on('ready', () => LOAD_EVENTS('ready')(Amy));
  /**
   * Emitted whenever a role is created.
   * @listens roleCreate
   */
  Amy.on('roleCreate', LOAD_EVENTS('roleCreate'));
  /**
   * Emitted whenever a guild role is deleted.
   * @listens roleDelete
   */
  Amy.on('roleDelete', LOAD_EVENTS('roleDelete'));
  /**
   * Emitted whenever a guild role is updated.
   * @listens roleUpdate
   */
  Amy.on('roleUpdate', LOAD_EVENTS('roleUpdate'));
  /**
   * Emitted for general warnings.
   * @listens warn
   */
  Amy.on('warn', LOAD_EVENTS('warn'));

  /**
  * Emitted whenever Amy doesn't have the required permission(s).
  * @listens AmyMissingPermissions
  */
  Amy.on('AmyMissingPermissions', LOAD_EVENTS('AmyMissingPermissions'));
  /**
   * Emitted whenever a command is used with invalid parameters.
   * @listens commandUsage
   */
  Amy.on('commandUsage', LOAD_EVENTS('commandUsage'));
  /**
   * Emitted whenever a moderation log event fires.
   * @listens moderationLog
   */
  Amy.on('moderationLog', LOAD_EVENTS('moderationLog'));
  /**
   * Emitted whenever Amy Currency is credited from a user.
   * @listens userCredit
   */
  Amy.on('userCredit', LOAD_EVENTS('userCredit'));
  /**
   * Emitted whenever Amy Currency is debited to a user.
   * @listens userDebit
   */
  Amy.on('userDebit', LOAD_EVENTS('userDebit'));
  /**
  * Emitted whenever the user doesn't have the required permission(s) to use a command.
  * @listens userMissingPermissions
  */
  Amy.on('userMissingPermissions', LOAD_EVENTS('userMissingPermissions'));
};
