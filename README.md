# Leavooo - Enterprise Leave Management System

Leavooo is a production-ready, full-stack Leave and Approval Management System. It features a hybrid frontend architecture optimized for different user roles and an AI-driven backend engine for risk assessment and auditing.

## 🌟 Core Features Showcase

### 🛠️ Advanced Backend Engine
-   **Multi-Tier Approval System**: Robust hierarchical logic enforcing the workflow: **Student -> HOD -> Admin**.
-   **Dynamic Role Engine**: Automated role assignment based on CEG.IN email subdomains (e.g., `@hod.cse.ceg.in`).
-   **Audit Trail & Logging**: Every status transition is captured with a timestamp and the actor's identity for transparency.
-   **Institutional Analytics**: aggregated reporting using MongoDB pipelines to track monthly trends and leave reasons.
-   **Smart Conflict Detection**: AI-based tagging (High Load/Risky) to alert approvers about concurrent institutional absences.

### 🎓 Applicant Portal (React)
-   **State-of-the-Art Dashboard**: Features high-end **Circular Balance Charts** for instant visual feedback on leave quotas.
-   **Live Notification Center**: A functional, interactive dropdown tracking approval outcomes and policy updates.
-   **Medical Attachment Logic**: Mandatory flag enforcement for long-duration leave requests (>3 days).
-   **Adaptive UX**: Full support for **Dark/Light Mode** with persistence via LocalStorage.
-   **Profile Control Center**: Dedicated settings for credential management and data verification.

### 🛡️ Approver Portal (Angular)
-   **Enterprise Bulk Operations**: Capability to process tens of leave requests simultaneously with batch checkboxes.
-   **Real-Time Monitoring**: Data-rich tables with multi-criteria **Filtering and Full-Text Search**.
-   **Visual Management Dashboard**: Responsive bar charts summarizing institutional attendance patterns.
-   **Administrator User Matrix**: Full Lifecycle management (CRUD) of all system users.
-   **System Threshold Control**: Dynamic configuration of AI risk parameters (e.g., concurrent leave limits).


## 🛠️ Tech Stack
-   **Frontend (Admin/Staff)**: Angular 17+, Material UI, RxJS, **Angular Signals**.
-   **Frontend (Students)**: React 18+, Tailwind CSS, Lucide Icons, **Context API**.
-   **Backend**: Node.js, Express, JWT, Mongoose, MongoDB.
-   **Deployment**: **Railway** (Server), Vercel (React/Angular).

## 🧩 Technical Implementation

### React Applicant Portal
-   **useState()**: Managed local UI states such as `darkMode` toggles, notification dropdown visibility, and form input buffering.
-   **useEffect()**: Synchronized application state with `localStorage` and handled API polling for real-time leave status updates.
-   **useContext()**: Centralized authentication state across the entire component tree via `AuthContext`.

### Angular Approver Portal
-   **Signals**: Leveraged `signal<any[]>` for highly efficient, fine-grained reactivity when managing the approval queue and user lists.
-   **Standalone Components**: Optimized bundle size and developer experience using modern Angular 17 architecture.
-   **Material Data Tables**: Implemented `MatTableDataSource` for real-time filtering and sorting of leave applications.

### Backend & Security
-   **JWT Strategy**: Implemented stateless authentication with custom `protect` middleware for role-based access control.
-   **Mongoose Aggregations**: Calculated complex institutional analytics using MongoDB's `$group` and `$trend` pipelines.
-   **Railway Deployment**: Configured Dockerized backend deployment for automatic scaling and CI/CD.

## 💻 Local Setup
1.  Clone the repository.
2.  Create `.env` in `server/`:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_atlas_uri
    JWT_SECRET=your_jwt_secret
    JWT_EXPIRE=30d
    ```
3.  Install & Run:
    ```bash
    npm run install-all
    cd server && npm run seed  # Populate initial accounts
    npm start                  # Concurrently start all 3 projects
    ```

## 🔒 Test Credentials (Updated)
-   **Admin**: `admin@ceg.in` / `password123`
-   **HOD**: `hod@hod.cse.ceg.in` / `password123`
-   **Student**: `karam@student.ceg.in` / `password123`

> [!WARNING]
> **Production Connectivity**: Ensure you update the `apiUrl` in `AuthService.ts` (Angular) and `api.js` (React) to match your **actual Railway URL**. The current ones are placeholders.

---
*Built with ❤️ for FST Leavooo.*

