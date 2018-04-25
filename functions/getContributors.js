const request = require('request-promise-native');
const github = require('../settings/credentials.json').github;

module.exports = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let options = {
        headers: {
          'User-Agent': 'Amy Discord Bot (https://ZoomMods.com)',
          'Authorization': github ? `token ${github.accessToken}` : undefined
        },
        uri: 'https://api.github.com/repos/TheAmyBot/Amy/contributors',
        json: true
      };

      let response = await request(options);

      let contributors = response.map(contributor => {
        return {
          id: contributor.id,
          username: contributor.login,
          url: contributor.html_url,
          contributions: contributor.contributions,
          avatar_url: contributor.avatar_url
        };
      });

      resolve(contributors);
    }
    catch (e) {
      reject(e);
    }
  });
};
