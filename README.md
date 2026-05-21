# CrewFlow — Team Task Manager

CrewFlow is a modern, full-stack collaborative project and task management dashboard designed for high-performance teams. It features strict Role-Based Access Control (RBAC), database referential integrity, real-time metrics aggregation, and automatic alerts for overdue milestones.

---

## CrewFlow Architecture Stack

- **Frontend**: React.js (Vite) + Tailwind CSS + Lucide Icons.
- **Backend**: Node.js + Express.js handling a clean REST API layer.
- **Database**: NoSQL (MongoDB with Mongoose ODM to handle strict validations & relationships).
- **Authentication**: Firebase Auth (Client-side signup/login generating JWTs verified on the Node.js backend using `firebase-admin`).
- **Resilient Offline Fallback**: Features a **Dual-Auth Mode** allowing local testing with a simulated JSON Web Token (JWT) system if Firebase variables are not set.

---

## Database Schemas (Mongoose)

### User Entity
- `firebaseUid`: String (Required, Unique, matches Firebase credentials).
- `email`: String (Required, strictly validated via regex `/.+\@.+\..+/`).
- `role`: String (Enum: `['Admin', 'Member']`, Defaults to `Member`).

### Project Entity
- `name`: String (Required, Trimmed).
- `description`: String (Optional).
- `createdBy`: ObjectId (Ref: `User`, Creator admin).
- `members`: Array of ObjectIds (Ref: `User`, Explicit workspace members).

### Task Entity
- `projectId`: ObjectId (Ref: `Project`, Target workspace).
- `assignedTo`: ObjectId (Ref: `User`, Assignee member).
- `title`: String (Required).
- `description`: String (Optional).
- `status`: String (Enum: `['To Do', 'In Progress', 'Done']`, Defaults to `To Do`).
- `dueDate`: Date (Required, evaluated dynamically for overdue status).
- `priority`: String (Enum: `['Low', 'Medium', 'High']`, Defaults to `Medium`).

---

## Step-by-Step Local Replication

Follow these instructions to clone and run the application locally on your Windows machine:

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally, OR a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier cluster.

### Setup Instructions

1. **Install Dependencies**:
   Navigate to the project root directory and install dependencies for both components:
   ```bash
   # Install Backend Dependencies
   cd backend
   npm install

   # Install Frontend Dependencies
   cd ../frontend
   npm install
   ```

2. **Configure Environment Variables**:
   
   - **Backend Configuration**:
     Create `backend/.env` (pre-created for you with local fallbacks) and configure your MongoDB connection:
     ```ini
     PORT=5000
     MONGO_URI=mongodb://127.0.0.1:27017/crewflow   # Your local MongoDB or Atlas link
     JWT_SECRET=crewflow_mock_secret_key_12345     # Used in local mock JWT auth
     USE_FIREBASE_ADMIN=false                      # Toggle true if using real Firebase SDK
     ```

   - **Frontend Configuration**:
     To use real Firebase, create `frontend/.env` and set:
     ```ini
     VITE_USE_FIREBASE=true
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```
     *Note: If `VITE_USE_FIREBASE` is set to `false` (default), the system launches in **Local Mock Auth Mode**, which generates simulated JWTs locally. This allows you to test the entire application instantly without configuring a Firebase project!*

3. **Running the Application**:
   Open two separate terminal windows:

   - **Terminal 1: Start Backend**
     ```bash
     cd backend
     npm run dev
     ```
     *(Launches Express server on `http://localhost:5000`)*

   - **Terminal 2: Start Frontend**
     ```bash
     cd frontend
     npm run dev
     ```
     *(Launches Vite dev server on `http://localhost:3000`)*

---

## Scripted Demo Walkthrough (2 to 5 Minutes)

Here is a step-by-step guide matching your required **Demo Video timeline** using the **Local Mock Mode** for frictionless recording:

### Member Registration & Blank State
1. Open your browser and navigate to `http://localhost:3000`.
2. Click **Sign up free**.
3. Input `member@crewflow.com` and password `password123`.
4. Leave the role toggle selected on **Member** and click **Create Account**.
5. You will see a beautiful dark, glassmorphism dashboard with an emerald-bordered **[Member]** pill in the top header.
6. The dashboard display cards (Total, Completed, Pending, Overdue) will show **0** counters, and a placeholder message will state: *"You have not been assigned to any project workspaces yet."*

### Admin Actions & Overdue Task Setup
1. Click **Sign Out** in the top right.
2. Under the login email, toggle the selector to **Admin Mode** (or click Sign Up and create an account with the role set to **Admin**).
3. Input `admin@crewflow.com` and password `password123`. Click **Sign In**.
4. Notice the header now proudly displays an Indigo-bordered **[Admin]** pill.
5. In the top header panel, click the indigo **New Project** button.
6. Input project name `Q3 Core Platform Rollout`, a description, and select `member@crewflow.com` from the member assignment list. Click **Initialize Project**.
7. Now, click the **New Task** button.
8. Set target project to `Q3 Core Platform Rollout` and assignee to `member@crewflow.com`.
9. Input task title: `Design Database Schemas & validation rules`.
10. Set the **Due Date** to a date **in the past** (e.g., yesterday).
11. Leave priority as `High` and click **Assign Task**.
12. **Boom!** The aggregate metrics grid immediately updates:
    - **Total Tasks**: `1`
    - **Pending**: `1`
    - **Overdue Tasks**: Prominently flashes a glowing **`1`** badge styled in bright crimson.
    - An warning banner labeled **Overdue** flashes with a pulsing animation next to the task item in the workspace board!

### Role Restrictions & Workflow Transition
1. Click **Sign Out**.
2. Sign back in as `member@crewflow.com` with `password123` (leaving Dev Role set to **Member**).
3. Notice that the Member:
    - **CANNOT** see the "New Project" and "New Task" buttons (enforcing client-side RBAC).
    - Can see their assigned project workspace `Q3 Core Platform Rollout` and their task.
    - The metric counts for their dashboard show: Total `1`, Overdue `1` (calculated dynamically based on tasks assigned directly to them).
4. On the task card, locate the status select dropdown. Click it and transition the status from **To Do** $\rightarrow$ **In Progress**.
5. Toggle back to **Done**. The dashboard metrics instantly re-aggregate:
    - **Total Tasks**: `1`
    - **Completed**: `1`
    - **Overdue Tasks**: Flashes back to a neutral **`0`** since completed tasks are automatically removed from the overdue aggregation.
    - The task card turns from To Do/In Progress styling to a solid, emerald-bordered **Done** pill, proving end-to-end database-synchronized state changes!
