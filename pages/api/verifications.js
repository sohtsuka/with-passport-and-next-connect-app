import nextConnect from 'next-connect'
import auth from '../../middleware/auth'
import { createVerification, findOriginUserByUsername, findUserByUsername } from '../../lib/db'
import { v4 as uuidv4 } from 'uuid'

const handler = nextConnect()

handler
  .use(auth)
  .post((req, res) => {
    const { username } = req.body
    if (!username) {
      return res.status(400).send('Missing fields')
    }
    // Here you check if the username has already been used
    // TODO: exclude unverified user
    const usernameExisted = !!findUserByUsername(req, username)
    if (usernameExisted) {
      return res.status(409).send('The username has already been used')
    }

    const originUser = findOriginUserByUsername(req, username)
    if (!originUser) {
      // TODO: consider whether to expose the existence of the user
      return res.status(400).end('Invalid username')
    }

    // TODO: consider more secure method
    const code = uuidv4()
    const maxAgeMillis = 3 * 60 * 1000  // 3 minutes
    const expiresAt = Date.now() + maxAgeMillis
    const verification = { username, email: originUser.email, code, expiresAt }
    createVerification(req, verification)
    // TODO: send code by email
    console.log(
      `Navigate to /signup/register?code=${code} for registering the user ${username}` +
      `(expires at ${new Date(expiresAt).toISOString()})`
    )
    res.status(201).json({})
  })

export default handler
