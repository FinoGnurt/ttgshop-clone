import { OAuth2Client } from 'google-auth-library'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export const verifyGoogleToken = async (credential: string, audience: string) => {
  // verify id token of google
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience
  })

  // get and return payload
  return ticket.getPayload()
}
