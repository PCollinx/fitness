# 🚀 Deployment Checklist

## ✅ Environment Setup Status

### Development (localhost:3000)

- [x] Using `.env.local` file
- [x] All credentials working
- [x] Database connected (Prisma Accelerate)
- [x] Google OAuth working
- [x] Email configuration working

### Production Deployment

- [x] **Fixed Prisma Build Issue:** Updated vercel.json
- [x] **Fixed Import Path Issues:** Added webpack alias configuration to next.config.js
- [x] **Fixed PostCSS Configuration:** Added proper PostCSS config for Tailwind CSS
- [x] **Fixed Domain Assignment Issue:** Removed autoAlias: false from vercel.json
- [ ] **Set Environment Variables in Vercel:**

1. **Go to Vercel Dashboard:**

   - Navigate to your project
   - Go to Settings > Environment Variables

2. **Add These Variables:**

   ```
   NEXTAUTH_URL=https://fitness-jet-five.vercel.app
   NEXTAUTH_SECRET=54ad303d88d44e9dece9106af1b0363e4eb1df0ffde2f07bb8fd311a572a510b
   DATABASE_URL=[copy from .env.local]
   GOOGLE_CLIENT_ID=[copy from .env.local]
   GOOGLE_CLIENT_SECRET=[copy from .env.local]
   EMAIL_SERVER=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USERNAME=[copy from .env.local]
   EMAIL_PASSWORD=[copy from .env.local]
   EMAIL_FROM=[copy from .env.local]
   ```

3. **Update Google OAuth Configuration:**

   **Go to Google Cloud Console:**

   - Visit: https://console.cloud.google.com/
   - Select your project
   - Go to "APIs & Services" > "Credentials"
   - Click on your OAuth 2.0 Client ID

   **Authorized JavaScript origins:**

   ```
   http://localhost:3000                    (existing - keep this)
   https://fitness-jet-five.vercel.app      (add for production)
   ```

   **Authorized redirect URIs:**

   ```
   http://localhost:3000/api/auth/callback/google                    (existing - keep this)
   https://fitness-jet-five.vercel.app/api/auth/callback/google      (add for production)
   ```

   **⚠️ Important Notes:**

   - Replace `YOUR-APP-NAME` with your actual Vercel app name: `fitness-jet-five`
   - No trailing slashes in URLs
   - Must use `https://` for production (not `http://`)
   - The redirect URI must exactly match NextAuth's callback pattern

4. **Fix Prisma Build Issue (if encountered):**

   **If you see "prisma: command not found" error:**

   The issue is that Vercel needs Prisma to generate the client during build.

   **Solution - Update your package.json scripts:**

   ```json
   {
     "scripts": {
       "build": "prisma generate && next build",
       "postinstall": "prisma generate"
     }
   }
   ```

   **Alternative: Create vercel.json build override:**

   ```json
   {
     "buildCommand": "prisma generate && next build"
   }
   ```

   **Then redeploy:**

   ```bash
   git add .
   git commit -m "Fix prisma build for Vercel"
   git push
   ```

## 🔧 Current Setup

**Environment File Priority:**

1. `.env.local` (development) ✅
2. `.env.production` (production via Vercel dashboard)
3. No `.env` file needed

**Security:**

- ✅ `.env.local` in gitignore
- ✅ Production template in gitignore
- ✅ No sensitive data in git repository

## 🎯 Next Steps

1. **For Production:** Set environment variables in Vercel dashboard
2. **For Google OAuth:** Update authorized domains for production
3. **Test:** Deploy and verify all features work in production

Your setup is now clean and secure! 🎉

## 🚨 **Google OAuth Troubleshooting**

### **Common Issues:**

1. **"redirect_uri_mismatch" Error:**

   - Check that redirect URI exactly matches: `https://your-domain.com/api/auth/callback/google`
   - No extra slashes or different paths

2. **"origin_mismatch" Error:**

   - Authorized JavaScript origin should be: `https://your-domain.com`
   - No `/api/auth` or other paths in origins

3. **OAuth Consent Screen:**
   - Make sure your OAuth consent screen is published
   - Add your production domain to authorized domains

### **Example Configuration:**

```
Project: fitness-jet-five.vercel.app

Authorized JavaScript origins:
✅ http://localhost:3000
✅ https://fitness-jet-five.vercel.app

Authorized redirect URIs:
✅ http://localhost:3000/api/auth/callback/google
✅ https://fitness-jet-five.vercel.app/api/auth/callback/google
```
