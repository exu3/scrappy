import { reply, t, unverifiedRequest } from '../../../lib/api-utils'

const wordList = [
  'fuck',
  'dumb',
  'suck',
  'stupid',
  'crap',
  'crappy',
  'trash',
  'trashy'
]

const messageContainsWord = (msg) => (
  wordList.some(word => msg.includes(word))
)

module.exports = async (req, res) => {
  console.log('hello from mention')
  if (unverifiedRequest(req)) {
    return res.status(400).send('Unverified Slack request!')
  } else {
    res.sendStatus(200)
  }

  console.log('hello 2')

  const { channel, ts, user, text, thread_ts } = req.body.event

  const containsWord = await messageContainsWord(text)
  if (containsWord) {
    reply(channel, thread_ts || ts, t('messages.mentionKeyword', {user}))
  } else {
    reply(channel, thread_ts || ts, t('messages.mention', {user}))
  }
}