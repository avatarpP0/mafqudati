#!/bin/bash
# ============================================================
# مفقوداتي - Mafqudati - Vercel Deployment Script
# ============================================================
# This script prepares and deploys the project to Vercel
# with PostgreSQL (required for serverless functions)
# ============================================================

set -e

echo "🚀 مفقوداتي - Mafqudati Vercel Deployment"
echo "=========================================="
echo ""

# Step 1: Switch Prisma schema to PostgreSQL
echo "📌 Step 1: Switching Prisma to PostgreSQL..."
cp prisma/schema.vercel.prisma prisma/schema.prisma
echo "   ✅ Prisma schema switched to PostgreSQL"

# Step 2: Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo ""
  echo "📌 Step 2: Installing Vercel CLI..."
  npm install -g vercel
  echo "   ✅ Vercel CLI installed"
else
  echo ""
  echo "📌 Step 2: Vercel CLI already installed ✅"
fi

# Step 3: Login to Vercel
echo ""
echo "📌 Step 3: Logging in to Vercel..."
vercel login

# Step 4: Deploy to Vercel (this will create the project if it doesn't exist)
echo ""
echo "📌 Step 4: Deploying to Vercel..."
vercel --prod

echo ""
echo "✅ Deployment initiated!"
echo ""
echo "⚠️  IMPORTANT: After deployment, you need to:"
echo "   1. Go to https://vercel.com/dashboard"
echo "   2. Select your project -> Storage -> Create Database -> Postgres (Neon)"
echo "   3. Link the database to your project"
echo "   4. Push the schema: Run 'vercel env pull' then 'npx prisma db push'"
echo "   5. Seed the database: Visit https://your-app.vercel.app/api/seed"
echo ""
echo "   Or set DATABASE_URL manually in Vercel Environment Variables."
echo ""
echo "🔄 To revert to local SQLite development:"
echo "   Restore the original schema.prisma from git"
