# Production Deployment Guide

## 🚀 Vercel Deployment Setup

### Step 1: Database Setup (Choose One)

#### Option A: Supabase (Recommended)

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Navigate to Settings > Database
3. Copy the connection string:
   ```
   postgresql://postgres:[password]@[host]:5432/postgres
   ```

#### Option B: Neon (Serverless)

1. Go to [neon.tech](https://neon.tech) and create a project
2. Copy the connection string from the dashboard

#### Option C: Railway

1. Go to [railway.app](https://railway.app) and create a PostgreSQL database
2. Copy the connection string

### Step 2: Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add these variables:

#### Database

```bash
DATABASE_URL=postgresql://user:pass@host:5432/dbname
DIRECT_URL=postgresql://user:pass@host:5432/dbname  # Optional
```

#### NextAuth

```bash
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=generate-a-strong-32-char-secret
```

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add your Vercel domain to authorized origins:
   - `https://your-domain.vercel.app`
   - `https://your-domain.vercel.app/api/auth`

```bash
GOOGLE_CLIENT_ID=your-production-client-id
GOOGLE_CLIENT_SECRET=your-production-client-secret
```

#### Email (Optional)

```bash
EMAIL_SERVER=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your-production-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-production-email@gmail.com
```

#### Build Configuration

```bash
NODE_ENV=production
NEXT_PUBLIC_ENV=production
SKIP_ENV_VALIDATION=true
```

### Step 3: Deploy

1. Connect your GitHub repository to Vercel
2. Vercel will automatically deploy on every push to main
3. First deployment will run database migrations

### Step 4: Database Migration

After deployment, run the database migrations:

```bash
# In your local terminal (with production DATABASE_URL)
npx prisma migrate deploy

# Or use Vercel CLI
vercel env pull .env.production
npx prisma migrate deploy
```

## 🔧 Local Development Setup

1. Copy the environment template:

   ```bash
   cp .env.example .env.local
   ```

2. Fill in your local development values in `.env.local`

3. Set up local database:

   ```bash
   # Install PostgreSQL locally or use Docker
   docker run --name fitness-postgres -e POSTGRES_PASSWORD=password -d -p 5432:5432 postgres

   # Run migrations
   npm run db:migrate
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

## 🛡️ Security Checklist

- [ ] Use strong, unique secrets for production
- [ ] Never commit `.env.local` or production secrets
- [ ] Use different OAuth apps for dev/prod
- [ ] Enable HTTPS only in production
- [ ] Use production-grade database
- [ ] Set up monitoring and logging
- [ ] Configure proper CORS settings
- [ ] Use environment-specific email accounts

## 🐛 Troubleshooting

### Build Failures

```bash
# Clear Next.js cache
rm -rf .next

# Regenerate Prisma client
npx prisma generate

# Check environment variables
npm run env:check
```

### Database Issues

```bash
# Reset database (DANGEROUS)
npx prisma migrate reset

# Check database connection
npx prisma db pull
```

### OAuth Issues

- Verify redirect URIs in Google Console
- Check NEXTAUTH_URL matches your domain
- Ensure NEXTAUTH_SECRET is set and secure
