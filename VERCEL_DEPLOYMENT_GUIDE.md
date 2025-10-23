# Vercel Deployment Guide

## 🚨 Fix for "Failed to fetch profile" (500 Error)

### Problem
The API routes are failing on Vercel with 500 errors because:
1. Prisma Client wasn't generated during build
2. Environment variables might be missing
3. Database connection issues

### Solution Applied

#### 1. Updated `package.json` ✅
Added scripts to ensure Prisma generates on Vercel:
```json
"scripts": {
  "build": "prisma generate && next build",
  "postinstall": "prisma generate"
}
```

#### 2. Added Database Connection Test ✅
Updated `lib/db.ts` to log connection status in production.

---

## 📋 Deployment Checklist

### Step 1: Verify Environment Variables in Vercel

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add ALL of these (copy from your `.env` file):

```bash
# Database Connection (Required)
DATABASE_URL=postgresql://neondb_owner:npg_WrN8URAfb7Ca@ep-dark-fire-adsu3yn0-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

DIRECT_URL=postgresql://neondb_owner:npg_WrN8URAfb7Ca@ep-dark-fire-adsu3yn0.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# JWT Secret (Required)
JWT_SECRET=IITp-auth123@

# Auth Gateway (Required)
NEXT_PUBLIC_IITP_AUTH_GATEWAY=https://iitp-auth.vercel.app

# App URL (Update with your Vercel URL)
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

**⚠️ IMPORTANT**: 
- Set all variables for **Production**, **Preview**, and **Development** environments
- Update `NEXT_PUBLIC_APP_URL` with your actual Vercel deployment URL

### Step 2: Push Updated Code

```bash
git add .
git commit -m "fix: add prisma generate to build process"
git push origin main
```

### Step 3: Trigger Redeploy in Vercel

1. Go to Vercel Dashboard
2. Click **Deployments** tab
3. Find latest deployment
4. Click **•••** menu → **Redeploy**
5. Check **Use existing build cache** is OFF
6. Click **Redeploy**

### Step 4: Check Build Logs

Watch for these lines in Vercel build logs:

✅ **Success indicators:**
```
Running "prisma generate"
✔ Generated Prisma Client
✓ Compiled successfully
✅ Database connected successfully
```

❌ **Error indicators:**
```
Prisma schema loaded from prisma/schema.prisma
Error: Environment variable not found: DATABASE_URL
```

If you see the error, go back to Step 1 and verify environment variables.

---

## 🔍 Debugging 500 Errors

### Check Vercel Function Logs

1. Go to: **Vercel Dashboard → Your Project → Deployments**
2. Click on latest deployment
3. Click **Functions** tab
4. Click on failing function (e.g., `/api/profile`)
5. Check logs for errors

### Common Issues & Solutions

#### Issue 1: "DATABASE_URL not found"
**Solution**: Add `DATABASE_URL` to Vercel environment variables

#### Issue 2: "Prisma Client not initialized"
**Solution**: 
- Ensure `postinstall` script is in `package.json`
- Redeploy with cache cleared

#### Issue 3: "Can't reach database server"
**Solution**:
- Verify Neon database is active (not sleeping)
- Check connection string is correct
- Test connection from Neon dashboard

#### Issue 4: "JWT_SECRET not defined"
**Solution**: Add `JWT_SECRET` to Vercel environment variables

---

## 🧪 Testing After Deployment

### 1. Test Database Connection
Open browser console on your deployed site:
```javascript
// Should see in Network tab
fetch('https://your-app.vercel.app/api/profile', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
})
```

### 2. Check Vercel Function Logs
- Should see "✅ Database connected successfully"
- No Prisma errors

### 3. Test Login Flow
1. Go to deployed URL
2. Click "Login"
3. Complete OTP verification
4. Should redirect to dashboard (not error)

---

## 📊 Expected Vercel Build Output

```bash
▲ Vercel CLI 28.0.0
📦 Building...
> Running "npm install"
> Running "prisma generate"
  ✔ Generated Prisma Client (v6.18.0)

> Running "npm run build"
> prisma generate && next build
  ✔ Generated Prisma Client (v6.18.0)
  
▲ Next.js 16.0.0
✓ Compiled successfully in 12.3s
✓ Collecting page data
✓ Generating static pages (22/22)

Serverless Functions:
  ƒ /api/profile
  ƒ /api/projects
  ƒ /api/education
  [16 functions total]

✅ Build completed successfully
```

---

## 🔐 Security Notes

### Database Credentials
- Never commit `.env` to git (already in `.gitignore` ✅)
- Use Vercel's encrypted environment variables
- Consider rotating credentials after initial setup

### JWT Secret
- Change `JWT_SECRET` before production use
- Use a strong random string (32+ characters)
- Example: `openssl rand -base64 32`

---

## 🆘 Still Getting 500 Errors?

### Quick Diagnostic Steps:

1. **Check Vercel Environment Variables**
   ```bash
   # All these should be set:
   DATABASE_URL ✓
   DIRECT_URL ✓
   JWT_SECRET ✓
   NEXT_PUBLIC_IITP_AUTH_GATEWAY ✓
   NEXT_PUBLIC_APP_URL ✓
   ```

2. **Check Neon Database Status**
   - Go to https://console.neon.tech
   - Verify database is active (not sleeping)
   - Check connection pooler is enabled

3. **Check Build Logs**
   - Look for "prisma generate" in build output
   - Verify no errors during Prisma generation

4. **Check Function Logs**
   - Open failing API route logs in Vercel
   - Look for specific error messages
   - Check if database connection succeeded

5. **Test Locally First**
   ```bash
   npm run build
   npm start
   # Visit http://localhost:3000
   # Should work before deploying
   ```

---

## 📞 Need Help?

If you're still stuck:

1. **Copy Build Logs**: Full output from Vercel build
2. **Copy Function Logs**: Error from `/api/profile` function logs
3. **Verify Environment Variables**: Screenshot of Vercel env vars (hide values)
4. **Check Neon Status**: Is database active?

With this info, we can diagnose the exact issue.

---

## ✅ Success Checklist

- [ ] `package.json` updated with `postinstall` script
- [ ] All environment variables added in Vercel
- [ ] `NEXT_PUBLIC_APP_URL` updated to Vercel deployment URL
- [ ] Code pushed to GitHub
- [ ] Redeployed in Vercel (cache cleared)
- [ ] Build logs show "Generated Prisma Client"
- [ ] Function logs show "Database connected successfully"
- [ ] Login works on deployed site
- [ ] Dashboard loads without 500 errors

---

**Last Updated**: October 23, 2025
