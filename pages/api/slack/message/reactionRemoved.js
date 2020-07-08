import { unverifiedRequest, getReactionRecord, reactionsTable } from "../../../../lib/api-utils"

export default async (req, res) => {
  if (unverifiedRequest(req)) return res.status(400).send('Unverified Slack request!')

  const { item, user, reaction } = req.body.event
  const ts = item.ts

  const update = (await updatesTable.read({
    maxRecords: 1,
    filterByFormula: `{Message Timestamp} = '${ts}'`
  }))[0]
  const reactionRecord = await getReactionRecord(reaction, update.id)

  let usersReacted = reactionRecord.fields['Users Reacted']
  const updatedUsersReacted = usersReacted.filter(userReacted => userReacted != user)

  reactionsTable.update(reactionRecord.id, {
    'Users Reacted': updatedUsersReacted
  })
}