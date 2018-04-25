/**
 * @file streamNotifier
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
*/

const CronJob = require('cron').CronJob;
const request = require('request-promise-native');

/**
 * Handles Amy's scheduled commands
 * @param {Amy} Amy Amy Discord client object
 * @returns {void}
 */
module.exports = Amy => {
  try {
    let job = new CronJob('0 * * * * *',
      async () => {
        try {
          for (let guild of Amy.guilds) {
            guild = guild[1];
            let streamersModel = await Amy.database.models.streamers.findOne({
              attributes: [ 'channelID', 'twitch' ],
              where: {
                guildID: guild.id
              }
            });
            if (streamersModel && streamersModel.channelID) {
              let twitchStreamers = streamersModel.dataValues.twitch ? streamersModel.dataValues.twitch : [];
              if (!twitchStreamers.length) continue;

              let options = {
                headers: {
                  'Client-ID': Amy.credentials.twitchClientID,
                  'Accept': 'Accept: application/vnd.twitchtv.v3+json'
                },
                url: `https://api.twitch.tv/kraken/streams/?channel=${twitchStreamers.join(',')}`,
                json: true
              };
              let response = await request(options);

              if (response._total > 0 && response.streams.length > 0) {
                let streams = response.streams;

                if (!guild.hasOwnProperty('lastStreamers')) {
                  guild.lastStreamers = [];
                }
                else {
                  /*
                   * If any live streamers (`lastStreamers`) have
                   * stopped streaming, remove them from `lastStreamers`.
                   */
                  guild.lastStreamers.forEach(stream => {
                    if (!streams.map(stream => stream._id).includes(stream)) {
                      guild.lastStreamers.splice(guild.lastStreamers.indexOf(stream), 1);
                    }
                  });
                }

                for (let stream of streams) {
                  /*
                   * If the (recently fetched) live streamer is not
                   * known, i.e. stored in `lastStreamers`, notify in the
                   * specified channel that the streamer is live, and add them
                   * to `lastStreamers`.
                   */
                  if (!guild.lastStreamers.includes(stream._id)) {
                    await Amy.channels.get(streamersModel.dataValues.channelID).send({
                      embed: {
                        color: Amy.colors.PURPLE,
                        author: {
                          name: stream.channel.display_name,
                          url: stream.channel.url,
                          icon_url: stream.channel.logo
                        },
                        title: stream.channel.status,
                        url: stream.channel.url,
                        description: `${stream.channel.display_name} is now live!`,
                        fields: [
                          {
                            name: 'Game',
                            value: stream.game,
                            inline: true
                          },
                          {
                            name: 'Viewers',
                            value: stream.viewers,
                            inline: true
                          }
                        ],
                        image: {
                          url: stream.preview.large
                        },
                        timestamp: new Date(stream.created_at)
                      }
                    });

                    guild.lastStreamers.push(stream._id);
                  }
                }
              }
            }
          }
        }
        catch (e) {
          Amy.log.error(e);
        }
      },
      () => {},
      false
    );
    job.start();
  }
  catch (e) {
    Amy.log.error(e);
  }
};
