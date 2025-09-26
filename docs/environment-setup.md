# Environment Configuration Documentation

## Development (.env.local)

```bash
# Database - Use local PostgreSQL for development
DATABASE_URL=postgresql://username:password@localhost:5432/fitness_dev
DIRECT_URL=postgresql://username:password@localhost:5432/fitness_dev

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-local-development-secret-here

# Google OAuth (Development)
GOOGLE_CLIENT_ID=your-dev-google-client-id
GOOGLE_CLIENT_SECRET=your-dev-google-client-secret

# Email Configuration (Development)
EMAIL_SERVER=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com

# Development Flags
NODE_ENV=development
NEXT_PUBLIC_ENV=development
```

## Production (Set in Vercel Dashboard)

```bash
# Database - Production PostgreSQL (Supabase/Neon/Railway)
DATABASE_URL=postgresql://prod_user:prod_pass@db.host.com:5432/fitness_prod
DIRECT_URL=postgresql://prod_user:prod_pass@db.host.com:5432/fitness_prod

# NextAuth Configuration
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=strong-production-secret-256-chars

# Google OAuth (Production)
GOOGLE_CLIENT_ID=production-google-client-id
GOOGLE_CLIENT_SECRET=production-google-client-secret

# Email Configuration (Production)
EMAIL_SERVER=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=production-email@gmail.com
EMAIL_PASSWORD=production-app-password
EMAIL_FROM=production-email@gmail.com

# Production Flags
NODE_ENV=production
NEXT_PUBLIC_ENV=production
SKIP_ENV_VALIDATION=true
```

## Environment Variable Priorities

1. `.env.production` (production builds)
2. `.env.local` (local overrides, gitignored)
3. `.env` (defaults, can be committed)
4. Vercel Environment Variables (highest priority in production)
