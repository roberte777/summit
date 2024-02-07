# Summit

## Authentication

We are using NextAuth for Authentication. Currently a user can sign in with the following:

- Google
- Microsoft (through Auth0)
- Auth0
- Email (passwordless)

For the email, we are using [resend](https://resend.com) and [react-email](https://react.email/docs/introduction) to
handle the styling of the emails.

## Deployments

This application is currently depolyed through [vercel](https://vercel.com).
