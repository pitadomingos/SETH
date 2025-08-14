
# SETH: AI-Powered Multi-School Management Prototype

Welcome to SETH, an advanced prototype for a multi-tenant, AI-powered School Management System built with Next.js, ShadCN UI, and Google's Genkit. This application is designed to showcase a powerful and scalable solution for modern educational institutions.

## About This Project

This application simulates a comprehensive educational ecosystem designed to serve multiple user roles:

-   **Global Admins (Developers):** Oversee the entire network, manage schools and their subscription tiers, provision new schools, analyze system-wide performance with AI, and access detailed user management and documentation.
-   **School Administrators:** Manage the operations of a single school, from admissions and finance to academic reporting.
-   **Premium Admins:** Manage a group of schools with consolidated views and management capabilities.
-   **Teachers:** Access AI tools for lesson planning, ad-hoc test generation, automated grading, and detailed attendance tracking.
-   **Students:** View their progress, take AI-graded tests, and access official documents like certificates and transcripts upon meeting academic and financial requirements.
-   **Parents:** Get a unified view of all their children's progress (even across different schools), receive AI-powered advice, manage finances, and submit new applications.

## Key Features

-   **Role-Based Dashboards & Permissions:** Each user role has a unique interface and a tailored set of capabilities.
-   **Multi-Tenancy Simulation:** The app dynamically loads data based on the logged-in user's school affiliation, simulating a real multi-school environment.
-   **AI-Powered Workflows:** Genkit is used to power features like:
    -   Performance-aware lesson planning.
    -   Ad-hoc test generation and automated grading.
    -   In-depth academic reports for classes, teachers, and entire schools.
    -   Personalized advice for parents and struggling students.
-   **Comprehensive Module Simulation:** Includes modules for Admissions, Finance, Academics, Sports, Events, and more.
-   **Subscription Tiers:** Simulates a SaaS model with Starter, Pro, and Premium tiers, unlocking features like AI tools and multi-school management for higher tiers.

## Getting Started

To run this prototype:

1.  **Set up Firebase:**
    *   Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
    *   In your new project, go to the **Build** section and click on **Firestore Database**.
    *   Click **Create database**.
    *   Select **Start in production mode** (we will update the rules).
    *   Choose a Firestore location (e.g., `us-central`).
    *   **IMPORTANT:** Ensure you are using **Native mode**, not Datastore mode.
    *   This app will automatically update your security rules for development.

2.  **Start the development server:**
    ```bash
    npm run dev
    ```
3.  Open your browser to `http://localhost:9002`.
4.  Use the credentials provided on the login page to explore the different user roles.
    -   **Developer/Global Admin:** `developer` / `dev123`
    -   **Premium Admin (Maplewood):** Log in as `admin3`
    -   **Northwood Admin:** `admin1`
    -   **Northwood Teacher:** `teacher1`
    -   ...and more, as detailed on the login screen.

This application uses a live Firebase backend. All data is persistent. The application will auto-seed with initial data if the database is empty.
# SETH
