import nextConnect from 'next-connect'
import auth from '../../middleware/auth'
import {
  getAllUsers,
  createUser,
  findUserByUsername,
  findVerificationByCode,
} from '../../lib/db'

const handler = nextConnect()

handler
  .use(auth)
  .get((req, res) => {
    // For demo purpose only. You will never have an endpoint which returns all users.
    // Remove this in production
    res.json({ users: getAllUsers(req) })
  })
  .post((req, res) => {
    const { code, username, password, name } = req.body
    if (!code || !username || !password || !name) {
      return res.status(400).send('Missing fields')
    }
    // Here you check if the username has already been used
    const usernameExisted = !!findUserByUsername(req, username)
    if (usernameExisted) {
      return res.status(409).send('The username has already been used')
    }

    // TODO: consider error message
    const verification = findVerificationByCode(req, code)
    if (!verification) {
      return res.status(400).send('Invalid code')
    }
    console.log(`Verification: ${JSON.stringify(verification)}`)
    // TODO: consider error message
    if (Date.now() > verification.expiresAt) {
      return res.status(400).send('Expired code')
    }
    // TODO: consider error message
    if (username !== verification.username) {
      return res.status(400).send('Code and username does not match')
    }

    const user = { username, password, name }
    // Security-wise, you must hash the password before saving it
    // const hashedPass = await argon2.hash(password);
    // const user = { username, password: hashedPass, name }
    createUser(req, user)

    // TODO: invalidate verification

    req.logIn(user, (err) => {
      if (err) throw err
      // Log the signed up user in
      res.status(201).json({
        user,
      })
    })
  })

export default handler
