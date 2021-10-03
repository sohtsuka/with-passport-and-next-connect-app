import { useState, useEffect } from 'react'
import Router from 'next/router'
import Link from 'next/link'

export default function SignupPage() {
  const [sent, setSent] = useState()
  const [errorMsg, setErrorMsg] = useState('')

  async function onSubmit(e) {
    e.preventDefault()

    const body = {
      username: e.currentTarget.username.value,
    }

    const res = await fetch('/api/verifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.status === 201) {
      setSent(true)
    } else {
      setErrorMsg(await res.text())
    }
  }

  useEffect(() => {
    // redirect to home if code is sent
    if (sent) Router.push('/signup/sent')
  }, [sent])

  return (
    <>
      <h1>Sign up to Example</h1>
      {errorMsg && <p className="error">{errorMsg}</p>}
      <div className="form-container">
        <form onSubmit={onSubmit}>
          <label>
            <span>Origin Username</span>
            <input type="text" name="username" required />
          </label>
          <div className="submit">
            <button type="submit">Send email</button>
            <Link href="/login">
              <a>I already have an account</a>
            </Link>
          </div>
        </form>
      </div>
    </>
  )
}
