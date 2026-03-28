
# FSTLeavooo
Leavooo - Leave And Approval Management System

# Vidumurai - Leave & Approval Management System

This repository contains completely decoupled React Applicant Portal, Angular Approver Portal, and a Node.js Backend Engine.

## Setup Configuration
Create a `.env` file in the `server/` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/vidumurai
JWT_SECRET=supersecret123
JWT_EXPIRE=30d
```

## Running Locally
At the root folder:
1. `npm run install-all`
2. `cd server && npm run seed`  (to populate users)
3. `npm start` (Runs Node server, React App, Angular App concurrently)

## Deployment

### MongoDB Atlas
1. Create a cluster on MongoDB Atlas.
2. In Network Access, allow IPs `0.0.0.0/0`.
3. In Database Access, create a user and copy the connection string. Replace your local `MONGO_URI` with this.

### Render (Backend)
1. Add `server/` folder to Render as a Web Service.
2. Build Command: `npm install`
3. Start Command: `npm start`
4. Add Environment Variables: `PORT`, `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRE`

### Vercel (React Frontend)
1. Import repository to Vercel and set Root Directory to `client-react`.
2. Framework: Vite. Build Command: `npm run build`.
3. Set environment variable pointing to Render Backend URL if necessary. Deploy.

### Netlify (Angular Frontend)
1. Import repository to Netlify and set Base Directory to `client-angular`.
2. Build Command: `npm run build`. Publish directory: `client-angular/dist/client-angular/browser`.
3. Set environment variable pointing to Backend URL. Deploy.

