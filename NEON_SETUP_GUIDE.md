# Setting Up Neon PostgreSQL Database

## Step 1: Create Neon Account and Database

1. Go to https://console.neon.tech
2. Sign up or log in
3. Click **"Create a project"**
4. Choose:
   - **Project name**: iitp-smartfolio (or any name you prefer)
   - **Region**: Choose closest to your location (e.g., AWS ap-south-1 for India)
   - **Postgres version**: Latest (15 or 16)
5. Click **"Create project"**

## Step 2: Get Connection Strings

After creating the project, you'll see a connection string. You need TWO connection strings:

1. **DATABASE_URL** (Pooled connection - for production/serverless)
   - In Neon dashboard, go to **Dashboard** → **Connection Details**
   - Toggle **"Pooled connection"** ON
   - Copy the connection string
   - It looks like: `postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require`

2. **DIRECT_URL** (Direct connection - for migrations)
   - Toggle **"Pooled connection"** OFF
   - Copy this connection string too
   - It looks similar but without pooling parameters

## Step 3: Update .env File

Open your `.env` file and replace the placeholder values:

```env
# Replace these with your actual Neon connection strings
DATABASE_URL="postgresql://your-user:your-password@ep-xxx.region.aws.neon.tech/your-db?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://your-user:your-password@ep-xxx.region.aws.neon.tech/your-db?sslmode=require"
```

**IMPORTANT**: 
- Keep both connection strings
- Do NOT commit `.env` to git (it's already in .gitignore)
- DATABASE_URL is for queries (uses connection pooling)
- DIRECT_URL is for migrations (direct connection)

## Step 4: Run Prisma Generate

After adding the connection strings, run:

```bash
npx prisma generate
```

This will create the Prisma client with types for all your models.

## Step 5: Create Database Tables

Run the migration to create all tables:

```bash
npx prisma migrate dev --name init
```

This will:
- Create all 8 tables in your Neon database
- Generate the Prisma client
- Create a migration history

## Step 6: Verify Setup

You can view your database in Neon:
- Go to Neon Console → **Tables**
- You should see all 8 tables created

Or use Prisma Studio:
```bash
npx prisma studio
```

This opens a GUI at http://localhost:5555 where you can view and edit data.

---

## Quick Reference

```bash
# Generate Prisma client
npx prisma generate

# Create migration and apply
npx prisma migrate dev --name migration_name

# Apply migrations in production
npx prisma migrate deploy

# Open Prisma Studio
npx prisma studio

# Reset database (careful!)
npx prisma migrate reset
```

---

## Troubleshooting

**Error: "Missing required environment variable: DATABASE_URL"**
- Make sure you've added the connection strings to `.env`
- Restart your terminal/IDE

**Error: "Can't reach database server"**
- Check if your connection string is correct
- Ensure your IP is allowed (Neon allows all IPs by default)

**Error: "SSL connection required"**
- Make sure you have `?sslmode=require` at the end of the connection string

---

Once you've completed these steps, let me know and we'll continue with creating the API routes!
