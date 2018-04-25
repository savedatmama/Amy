/**
 * @file userDebit event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = async (member, amount) => {
  try {
    let guildMemberModel = await member.client.database.models.guildMember.findOne({
      attributes: [ 'AmyCurrencies' ],
      where: {
        userID: member.id,
        guildID: member.guild.id
      }
    });

    /*
     * If the user doesn't have a profile, create their profile
     * & add Amy Currencies.
     */
    if (!guildMemberModel) {
      return await member.client.database.models.guildMember.create({
        userID: member.id,
        guildID: member.guild.id,
        AmyCurrencies: parseInt(amount)
      },
      {
        fields: [ 'userID', 'guildID', 'AmyCurrencies' ]
      });
    }

    /*
     * Add the given amount of Amy Currencies to the user's account.
     */
    await member.client.database.models.guildMember.update({
      AmyCurrencies: parseInt(guildMemberModel.dataValues.AmyCurrencies) + parseInt(amount)
    },
    {
      where: {
        userID: member.id,
        guildID: member.guild.id
      },
      fields: [ 'AmyCurrencies' ]
    });

    /*
     * Add the transaction detail to transactions table.
     */
    await member.client.database.models.transaction.create({
      userID: member.id,
      guildID: member.guild.id,
      type: 'debit',
      amount: parseInt(amount)
    },
    {
      fields: [ 'userID', 'guildID', 'type', 'amount' ]
    });
  }
  catch (e) {
    member.client.log.error(e);
  }
};
