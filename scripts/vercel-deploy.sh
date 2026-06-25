#!/bin/bash
# Mafqudati - Vercel Deployment Script
# This script prepares and deploys the project to Vercel with PostgreSQL

set -e

echo "🚀 Mafqudati - Vercel Deployment"
echo "=================================="
echo ""

# Step 1: Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo "❌ Vercel CLI not found. Installing..."
  npm install -g vercel
fi

# Step 2: Login to Vercel
echo "📌 Step 1: Logging in to Vercel..."
vercel login

# Step 3: Create Vercel Postgres database
echo ""
echo "📌 Step 2: You need to create a Vercel Postgres database."
echo "   Go to: https://vercel.com/dashboard -> Storage -> Create Database -> Postgres"
echo "   Or run: vercel postgres create"
echo ""
echo "   After creating, copy the connection string (POSTGRES_PRISMA_URL)"
echo ""

read -p "Enter your PostgreSQL connection string: " DATABASE_URL

if [ -z "$DATABASE_URL" ]; then
  echo "❌ No database URL provided. Exiting."
  exit 1
fi

# Step 4: Switch Prisma schema to PostgreSQL
echo ""
echo "📌 Step 3: Switching Prisma schema to PostgreSQL..."
sed -i 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma

# Step 5: Generate Prisma client with PostgreSQL
echo "📌 Step 4: Generating Prisma client..."
DATABASE_URL="$DATABASE_URL" npx prisma generate

# Step 6: Push schema to PostgreSQL
echo "📌 Step 5: Pushing schema to PostgreSQL..."
DATABASE_URL="$DATABASE_URL" npx prisma db push

# Step 7: Seed the database
echo "📌 Step 6: Seeding the database..."
DATABASE_URL="$DATABASE_URL" npx tsx seed.ts

# Step 8: Deploy to Vercel
echo "📌 Step 7: Deploying to Vercel..."
vercel env add DATABASE_URL production <<< "$DATABASE_URL"
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "⚠️  To revert local development to SQLite, run:"
echo "   sed -i 's/provider = \"postgresql\"/provider = \"sqlite\"/' prisma/schema.prisma"
echo "   bun run db:push"
echo "   bun run seed.ts"
