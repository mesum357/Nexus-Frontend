# Environment Variables Setup

## Creating .env File

Create a `.env` file in the root of the Nexus-Frontend directory with the following content:

```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

**Replace the URL with your actual backend URL:**

- For local development: `http://localhost:3000`
- For production: Your Render backend URL (e.g., `https://your-backend.onrender.com`)

## Alternative Environment Variable Name

You can also use `VITE_API_URL` instead:

```env
VITE_API_URL=https://your-backend-url.onrender.com
```

## Example .env File

```env
# Backend API URL
VITE_API_BASE_URL=https://nexus-backend.onrender.com
```

## Important Notes

- The `.env` file is already in `.gitignore` and will not be committed to Git
- Vite requires environment variables to be prefixed with `VITE_` to be accessible in the browser
- After creating or updating the `.env` file, restart your development server
- In production (Render), set the environment variable in Render's dashboard, not in a `.env` file

## Environment Variable Priority

The application checks for environment variables in this order:
1. `VITE_API_BASE_URL` (recommended)
2. `VITE_API_URL` (alternative)
3. Production fallback (if in production mode and no env var is set)
4. Development fallback: `http://localhost:3000`

