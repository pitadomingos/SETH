# EduManage: Multi-School Management System Prototype

Welcome to EduManage, an advanced prototype for a multi-tenant, AI-powered School Management System built with Next.js, ShadCN UI, and Google's Genkit.

## About This Project

This application simulates a comprehensive educational ecosystem designed to serve multiple user roles:

-   **Global Admins (Developers):** Oversee the entire network, manage schools, and access system-wide analytics.
-   **School Administrators:** Manage the operations of a single school, from admissions and finance to academic reporting.
-   **Premium Admins:** Manage a group of schools with consolidated views.
-   **Teachers:** Access AI tools for lesson planning, test generation, grading, and attendance.
-   **Students:** View their progress, take AI-graded tests, and access official documents.
-   **Parents:** Get a unified view of all their children's progress, even if they attend different schools in the network.

## Key Features

-   **Role-Based Dashboards & Permissions:** Each user role has a unique interface and set of capabilities.
-   **Multi-Tenancy Simulation:** The app dynamically loads data based on the logged-in user's school affiliation, simulating a real multi-school environment.
-   **AI-Powered Workflows:** Genkit is used to power features like:
    -   Performance-aware lesson planning.
    -   Ad-hoc test generation and automated grading.
    -   In-depth academic reports for classes, teachers, and entire schools.
    -   Personalized advice for parents and struggling students.
-   **Comprehensive Module Simulation:** Includes modules for Admissions, Finance, Academics, Sports, Events, and more.

## Getting Started

To run this prototype:

1.  **Start the development server:**
    ```bash
    npm run dev
    ```
2.  Open your browser to `http://localhost:9002`.
3.  Use the credentials provided on the login page to explore the different user roles.
    -   **Developer/Global Admin:** `developer` / `dev123`
    -   **Northwood Admin:** `admin1` / `admin123`
    -   **Northwood Teacher:** `teacher1` / `teacher123`
    -   ...and more, as detailed on the login screen.

This is a prototype environment. All data is mocked and will reset when the application is reloaded.
