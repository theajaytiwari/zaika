# Zaika — reels-first food ordering

Zaika is a full-stack food discovery app: users scroll dish reels, explore restaurant menus, add dishes to a bag, check out and follow their order. Restaurant partners publish menu reels and manage the order queue from their own dashboard.

## Run locally

1. In `backend`, copy `.env.example` to `.env` and add a MongoDB connection string plus a long JWT secret. ImageKit values are only needed when uploading a video file; partner dashboards can also publish a public video URL.
2. Start the API:

   ```powershell
   cd backend
   npm install
   npm run dev
   ```

3. In another terminal, start the frontend:

   ```powershell
   cd frontend\create-my-app
   npm install
   npm run dev
   ```

Open `http://localhost:5173`. The Vite development server proxies `/api` requests to `http://localhost:3000`; the production Vercel deployment serves both from one domain.

## Deploy to Vercel

Import the GitHub repository in Vercel from its root directory. Set `MONGODB_URL`, `JWT_SECRET`, `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, and `IMAGEKIT_URL_ENDPOINT` from `backend/.env` as encrypted production environment variables. Set `CLIENT_URL` to the final Vercel URL. Every push to `main` then triggers a new deployment.

## Included flows

- Public, responsive food-reel discovery with search and categories.
- Customer and restaurant registration/login using secure HTTP-only JWT cookies.
- Restaurant profiles, reel publishing, menu management and order-status queue.
- Persistent MongoDB carts, checkout, payment choice and order history.
- Role guards, clean API errors, validation, CORS configuration and a health endpoint.

## Main API routes

`/api/auth`, `/api/food`, `/api/cart`, and `/api/orders` are the main API namespaces. The backend health check is available at `/`.
