# Render Deployment Guide for Nexus Frontend

## Environment Variables Setup

Create a `.env` file in the root of the Nexus-Frontend directory with the following:

```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

**Important:** Replace `https://your-backend-url.onrender.com` with your actual Render backend URL.

**Alternative:** You can also use `VITE_API_URL` instead of `VITE_API_BASE_URL` if preferred.

## Deploying to Render

### Option 1: Using render.yaml (Recommended)

1. Push your code to GitHub
2. Connect your GitHub repository to Render
3. Render will automatically detect the `render.yaml` file
4. In the Render dashboard, add the environment variable:
   - Go to your service settings
   - Navigate to "Environment"
   - Add `VITE_API_BASE_URL` with your backend URL
   - Example: `https://your-backend.onrender.com`
   - Optionally add `VITE_API_URL` as an alternative (if used)

### Option 2: Manual Configuration

1. Create a new **Static Site** service in Render
2. Connect your GitHub repository
3. Configure the following:
   - **Name:** nexus-frontend (or your preferred name)
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
   - **Environment Variables:**
     - `VITE_API_BASE_URL`: Your backend URL (e.g., `https://your-backend.onrender.com`)
     - `VITE_API_URL`: (Optional) Alternative name for backend URL

### Important Notes

- Vite requires environment variables to be prefixed with `VITE_` to be accessible in the browser
- The `VITE_API_BASE_URL` or `VITE_API_URL` must be set as an environment variable in Render's dashboard
- After setting environment variables, Render will rebuild your application
- Make sure your backend CORS settings allow requests from your Render frontend URL
- The application will fallback to `https://nexusbackend-production.up.railway.app` if no environment variable is set (for backward compatibility)

## Local Development

For local development, create a `.env` file in the Nexus-Frontend root:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Or:

```env
VITE_API_URL=http://localhost:3000
```

Then run:
```bash
npm install
npm run dev
```

## Build and Preview

To build and preview locally:
```bash
npm run build
npm run preview
```

## Environment Variable Priority

The application checks for environment variables in this order:
1. `VITE_API_BASE_URL`
2. `VITE_API_URL`
3. Production fallback: `https://nexusbackend-production.up.railway.app` (only in production mode)
4. Development fallback: `http://localhost:3000`

