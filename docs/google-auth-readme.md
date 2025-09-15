# Google Authentication for Fitness App

This README provides a quick guide for setting up Google authentication in your fitness application.

## Quick Start

1. **Set up environment variables**

   Create or update your `.env.local` file with:

   ```
   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-super-secure-secret-key

   # Google OAuth
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

2. **Get Google OAuth credentials**

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a project
   - Enable the Google OAuth API
   - Configure OAuth consent screen
   - Create OAuth client ID for web application
   - Add authorized origins: `http://localhost:3000`
   - Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
   - Copy Client ID and Secret to your `.env.local` file

3. **Run database migrations**

   ```bash
   npx prisma migrate dev
   ```

4. **Start your application**

   ```bash
   npm run dev
   ```

5. **Test Google authentication**

   - Navigate to your sign-in page
   - Click "Continue with Google"
   - Authenticate with Google
   - You should be redirected back to your application

## Authentication Flow

When a user clicks "Continue with Google":

1. User is redirected to Google's authentication page
2. After authenticating, Google redirects back to your application with an authorization code
3. NextAuth exchanges this code for access tokens
4. NextAuth creates or retrieves the user in your database
5. User is signed in and redirected to the callback URL (e.g., `/dashboard`)

## Features

- **Account Linking**: Users can link multiple authentication providers to the same account
- **Session Management**: NextAuth handles session creation and validation
- **Token Rotation**: Refresh tokens are used to maintain the session
- **TypeScript Support**: Full type safety for authentication data

## Documentation

For more detailed information, see:

- [Google Authentication Setup Guide](./docs/google-auth-setup-guide.md)
- [Google OAuth Setup Guide](./docs/google-oauth-setup.md)

## Troubleshooting

If you encounter issues:

- Check that your redirect URI exactly matches what's configured in Google Cloud Console
- Verify your environment variables are correctly set
- Ensure your database is properly migrated
- Look for error messages in the browser console and server logs

## Security Considerations

- In production, use a strong, unique `NEXTAUTH_SECRET`
- Store credentials securely in your production environment
- Add your production domain to authorized origins and redirect URIs in Google Cloud Console
- Consider implementing additional security measures like rate limiting
