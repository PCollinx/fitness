# Setting Up Google Authentication in Your Fitness App

This guide will walk you through the steps to set up Google Authentication in your fitness application.

## Overview of Current Setup

Your application already has most of the code in place for Google authentication:

1. The `auth-options.ts` file includes the Google provider configuration
2. The sign-in and sign-up pages have buttons to authenticate with Google
3. The NextAuth API routes are properly configured

## Step 1: Set Up Environment Variables

1. Ensure your `.env.local` file contains these variables:

   ```
   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-super-secure-secret-key

   # Google OAuth
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

## Step 2: Get Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Configure the OAuth consent screen:
   - User Type: External
   - App name: "Fitness App"
   - Support email: Your email
   - Authorized domains: Your domain (for production)
   - Developer contact information: Your email
6. Add scopes for:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `openid`
7. Create OAuth Client ID:
   - Application type: Web application
   - Name: "Fitness App"
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - `https://your-production-url.com` (for production)
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://your-production-url.com/api/auth/callback/google` (for production)
8. Copy the Client ID and Client Secret and add them to your `.env.local` file

## Step 3: Database Configuration for OAuth Accounts

Ensure your Prisma schema has the necessary tables for OAuth accounts. Your schema should include:

```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  password      String?
  accounts      Account[]
  sessions      Session[]
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

If you need to update your schema, run:

```
npx prisma migrate dev --name add_oauth_tables
```

## Step 4: Verify Your NextAuth Configuration

Your current NextAuth configuration in `lib/auth/auth-options.ts` looks good. It includes:

- PrismaAdapter for database integration
- GoogleProvider with environment variables
- Proper callbacks for session and JWT handling

## Step 5: Testing

1. Start your development server:

   ```
   npm run dev
   ```

2. Navigate to your sign-in page
3. Click the "Continue with Google" button
4. You should be redirected to Google's sign-in page
5. After signing in, you should be redirected back to your app (to the dashboard)

## Troubleshooting

If you encounter issues:

1. **Redirect URI Mismatch**: Ensure the redirect URI in Google Console exactly matches `http://localhost:3000/api/auth/callback/google`

2. **Invalid Client ID**: Double-check that you've copied the correct Client ID and Secret to your `.env.local` file

3. **Database Issues**: Ensure your database is properly set up with the required tables. You can run:

   ```
   npx prisma migrate reset
   ```

   to reset your database and apply all migrations.

4. **NextAuth Secret**: Make sure your `NEXTAUTH_SECRET` is properly set in your `.env.local` file

5. **Console Logs**: Check your browser console and server logs for specific error messages

## Production Deployment

When deploying to production:

1. Update your `NEXTAUTH_URL` to your production URL
2. Add your production URL to the authorized origins and redirect URIs in the Google Cloud Console
3. Ensure your environment variables are properly set in your production environment
4. Consider using a more secure method to store your `NEXTAUTH_SECRET`

## Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/providers/google)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Prisma Schema Documentation](https://www.prisma.io/docs/concepts/components/prisma-schema)
