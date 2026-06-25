# 🚀 مفقوداتي - Mafqudati: Vercel Deployment Guide
# دليل نشر الموقع على Vercel

## Method 1: Deploy via Vercel Dashboard (Easiest - Recommended)

### Step 1: Push code to GitHub
1. Create a new repository on GitHub
2. Push the project code:
```bash
git init
git add .
git commit -m "Initial commit - Mafqudati Lost & Found"
git remote add origin https://github.com/YOUR_USERNAME/mafqudati.git
git push -u origin main
```

### Step 2: Switch Prisma to PostgreSQL
Before pushing, change `prisma/schema.prisma`:
```
datasource db {
  provider = "postgresql"    # Change from "sqlite" to "postgresql"
  url      = env("DATABASE_URL")
}
```
A ready-made PostgreSQL schema is in `prisma/schema.vercel.prisma` - just rename it to `schema.prisma`.

### Step 3: Connect to Vercel
1. Go to https://vercel.com and sign up/login
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings

### Step 4: Create a PostgreSQL Database
1. In Vercel Dashboard, go to your project -> "Storage" tab
2. Click "Create Database" -> select "Postgres (Neon)"
3. Choose the free plan
4. Vercel will automatically add the DATABASE_URL environment variable

### Step 5: Deploy
1. Go to your project -> "Deployments" tab
2. Click "Redeploy"
3. Wait for the build to complete

### Step 6: Seed the Database
After deployment, visit your app URL + `/api/seed`:
```
https://your-app-name.vercel.app/api/seed
```
This will populate the database with sample data.

---

## Method 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Switch Prisma to PostgreSQL
Rename `prisma/schema.vercel.prisma` to `prisma/schema.prisma`

### Step 3: Login and Deploy
```bash
vercel login
vercel --prod
```

### Step 4: Create Database and Seed
Same as Method 1 Steps 4-6

---

## Environment Variables for Vercel

| Variable | Description | Example |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | postgresql://user:pass@host/db?sslmode=require |

The DATABASE_URL will be automatically set when you create a Vercel Postgres database.

---

## Troubleshooting

### Build Error: Prisma Client could not be generated
- Make sure `prisma/schema.prisma` uses `provider = "postgresql"`
- Make sure the `postinstall` script is in `package.json`: `"postinstall": "npx prisma generate"`

### Database connection error
- Verify DATABASE_URL is set in Vercel Environment Variables
- Make sure the PostgreSQL database is active in Vercel Storage

### Empty site after deployment
- Visit `/api/seed` to populate the database with sample data
