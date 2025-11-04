# Deployment Guide

## Vercel Deployment

### Step 1: Add Environment Variable

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variable:

   ```
   Name: VITE_OPENAI_API_KEY
   Value: sk-proj-your-actual-openai-api-key
   ```

4. ⚠️ **IMPORTANT**: The variable name MUST start with `VITE_` for Vite to expose it to the client-side code
5. Select all environments (Production, Preview, Development)
6. Click **Save**

### Step 2: Redeploy

After adding the environment variable:

1. Go to the **Deployments** tab
2. Click the three dots (`...`) on the latest deployment
3. Click **Redeploy**

Alternatively, just push a new commit and Vercel will automatically redeploy.

### Step 3: Verify

1. Open your deployed app
2. Open browser DevTools (F12) → Console tab
3. Look for: `✅ OpenAI API key configured`
4. If you see `⚠️ OpenAI not configured`, the environment variable wasn't set correctly

## Troubleshooting

### "OpenAI not configured" in deployed app

**Check the variable name:**
- Must be `VITE_OPENAI_API_KEY` (with VITE_ prefix)
- NOT `OPENAI_API_KEY` (without prefix)

**Redeploy after adding:**
- Environment variables only take effect on new builds
- Redeploy after adding the variable

**Check the value:**
- Should start with `sk-proj-` or `sk-`
- No extra spaces or quotes

### Console shows errors about OpenAI

**Check browser console for details:**
```javascript
// Should see:
✅ OpenAI API key configured
✅ OpenAI client initialized successfully

// If you see:
ℹ️ No OpenAI API key found
// → Variable not set or wrong name

⚠️ OpenAI API key does not start with sk-
// → Invalid API key format
```

### Blank screen after deployment

The app now has an ErrorBoundary that will show errors instead of blank screen.

**Common causes:**
1. Missing environment variable → Shows error message
2. IndexedDB blocked (Safari private mode) → Use regular browsing
3. React initialization error → Check console for details

**Quick fix:**
- Open browser DevTools (F12)
- Check Console tab for error messages
- The ErrorBoundary will display the error with a reload button

## Security Note

⚠️ **The OpenAI API key is exposed in the client-side bundle.**

This is acceptable for:
- Personal projects
- Prototypes
- Development/testing

For production apps with public users:
- Set up usage limits in OpenAI dashboard
- Consider moving to a backend API route
- Use serverless functions (see `api/` directory if implemented)

## Alternative: Backend API Route (More Secure)

Instead of exposing the API key:

1. Create serverless function in `api/generate.ts`
2. Use `OPENAI_API_KEY` (without VITE_ prefix) in Vercel
3. Call your API route from frontend instead of OpenAI directly

This keeps the API key server-side only.
