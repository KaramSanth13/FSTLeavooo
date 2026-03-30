# Leavooo - Enterprise Leave Management System

Leavooo is a production-ready, full-stack Leave and Approval Management System. It features a hybrid frontend architecture optimized for different user roles and an AI-driven backend engine for risk assessment and auditing.

## 🚀 Key Features

### Backend Engine (Node.js/Express)
1.  **Audit Logs**: Comprehensive tracking of every status transition and profile change.
2.  **Advanced Analytics**: Deep insights into leave trends by month, reason, and department.
3.  **Medical Certificate Logic**: Automated enforcement of attachment requirements for leaves > 3 days.
4.  **Profile Management API**: Secure password hashing and personal detail updates.
5.  **User Management Admin API**: Full control over user lifecycle (List/Delete/Promote).

### Applicant Portal (React/Vite)
1.  **Circular Leave Balance UI**: Real-time visual tracking of remaining leave days.
2.  **Notification System**: Instant alerts for leave status updates (Approved/Rejected).
3.  **Profile Settings**: Dedicated interface for managing credentials and personal info.
4.  **Medical Cert Mock Upload**: Integrated validation for long-duration leave requests.
5.  **Portal Switcher**: Seamless cross-navigation between Applicant and Approver portals.

### Approver Portal (Angular/Material)
1.  **Bulk Approval/Rejection**: Process dozens of requests with a single click.
2.  **Advanced Filtering**: Multi-criteria search (Reason/Priority/Applicant) for efficient queueing.
3.  **Management Dashboard**: Visualized stats and bar charts for institution-wide trends.
4.  **User Management CRUD**: Centralized administrator dashboard for adding/removing users.
5.  **System Settings**: Configurable AI thresholds and institutional workflow policies.

## 🛠️ Tech Stack
-   **Frontend (Admin/Staff)**: Angular 17+, Material UI, RxJS, Signals.
-   **Frontend (Students)**: React 18+, Tailwind CSS, Lucide Icons, Context API.
-   **Node.js/Express Backend**: Clean MVC architecture with JWT auth and MongoDB.
-   **React Applicant Portal**: Modern UI/UX with circular progress and skeleton loaders.
-   **Angular Approver Portal**: Enterprise-grade management dashboard.

## 🚀 Angular Unique Features (Approver Portal)
The Angular stack leverages modern features (v17.3+) to provide a high-performance experience:
1.  **Angular Signals**: Used in `AuthService` and `LeaveService` for fine-grained, reactive state management without unnecessary change detection cycles.
2.  **Standalone Components**: Modern architecture where every component manages its own imports (e.g., `MatTableModule`, `MatIconModule`), reducing bundle size.
3.  **Functional Interceptors**: implemented `authInterceptor` to dynamically inject JWT tokens into every outgoing API request.
4.  **Custom Attribute Directives**: `HighlightRiskDirective` automatically applies professional styling to table rows based on AI-calculated risk tags.
5.  **Custom Transformation Pipes**: `BalanceStatusPipe` transforms raw numeric data into human-readable, color-coded health statuses (Critical/Low/Healthy).

## 🛠️ Local Setup
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

---
*Built with ❤️ for FST Leavooo.*

