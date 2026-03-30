# Deployment Guide: Leavooo Enterprise

## 1. Backend (Railway)
1.  **Repository**: Connect your GitHub repository.
2.  **Root Directory**: `server`
3.  **Environment Variables**:
    - `MONGO_URI`: Your MongoDB Atlas connection string.
    - `JWT_SECRET`: A secure random string.
    - `JWT_EXPIRE`: `30d`
4.  **Deployment**: Railway will automatically detect the `Dockerfile` in the server directory and deploy.

## 2. Frontend (Vercel)
Deploy both `client-react` and `client-angular` as individual projects.

### Applicant Portal (React)
- **Root Directory**: `client-react`
- **Framework Preset**: `Vite`
- **Environment Variables**:
  - `VITE_API_URL`: Your Railway backend URL + `/api`

### Approver Portal (Angular)
- **Root Directory**: `client-angular`
- **Framework Preset**: `Angular`
- **Build Command**: `npm run build`
- **Output Directory**: `dist/browser`
- **Rewrites**: Handled via `vercel.json` in the folder.

---
*Leavooo - Empowering Institutional Workflows.*
