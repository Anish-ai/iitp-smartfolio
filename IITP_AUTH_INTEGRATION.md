# IITP SmartFolio Authentication Integration

This project uses the **IITP Auth Gateway** for secure, centralized authentication of IIT Patna students.

## 🔐 Authentication Flow

1. **User clicks "Login with IITP Email"** on `/login`
2. **Redirects to IITP Auth Gateway** (`https://iitp-auth.vercel.app/auth`)
3. **User enters IITP email** and receives OTP via email
4. **User verifies OTP** on gateway page
5. **Gateway redirects back** to `/auth/callback` with JWT token
6. **App extracts user data** from token and creates session

## 🚀 Setup

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. (Optional) Customize the gateway URL if using a different instance:
   ```env
   NEXT_PUBLIC_IITP_AUTH_GATEWAY=https://your-custom-gateway.vercel.app
   ```

3. Install dependencies and run:
   ```bash
   npm install
   npm run dev
   ```

## 📋 User Data Structure

After authentication, the user object includes IITP-specific fields:

```typescript
{
  id: string              // Roll number or email-based ID
  email: string           // student@iitp.ac.in
  name: string            // Extracted from email
  rollNumber?: string     // e.g., "2301mc40"
  admissionYear?: number  // e.g., 2023
  degree?: string         // e.g., "B.Tech"
  branch?: string         // e.g., "Mathematics & Computing"
  verified: boolean       // Always true after gateway auth
}
```

## 🔧 Key Files

- **`lib/auth.ts`** - Auth helpers and IITP gateway integration
- **`app/login/page.tsx`** - Login page (redirects to gateway)
- **`app/auth/callback/page.tsx`** - Handles callback from gateway
- **`lib/hooks/use-auth.ts`** - React hook for auth state

## 📝 Notes

- Only **@iitp.ac.in** email addresses are accepted by the gateway
- OTPs expire after **5 minutes**
- Session persists in **localStorage** for client-side state
- The gateway is **stateless** and uses JWT tokens

## 🌐 IITP Auth Gateway

- **Production URL**: https://iitp-auth.vercel.app
- **Documentation**: Refer to gateway's README for API details
- **Features**: OTP via email, student info extraction, rate limiting

## 🔒 Security

- All communication with gateway is over **HTTPS**
- JWT tokens are **signed** by the gateway
- Tokens contain user data and cannot be forged
- Client-side token parsing for convenience (verify server-side for sensitive operations)
