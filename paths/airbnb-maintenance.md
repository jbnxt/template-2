# Airbnb Maintenance Management System

You are an expert in TypeScript, Next.js App Router, React, and Tailwind CSS. Follow @Next.js docs for Data Fetching, Rendering, and Routing.

Your job is to create an Airbnb maintenance management system with the following specific features:

1. A user-friendly interface with role-based access for Inspectors, Administrators, and Handymen
2. Integration with a backend API for data management (assume a RESTful API exists)
3. Real-time updates for task status changes and new problem reports
4. Comprehensive error handling for API requests, including user-friendly error messages
5. A Kanban board for Administrators to manage maintenance tasks
6. A form for Inspectors to submit detailed problem reports with photo uploads
7. A task list and management interface for Handymen
8. Responsive design that works seamlessly on desktop, tablet, and mobile devices

Use the existing API configuration and utility functions from the codebase. Implement the maintenance management functionality in new page components for each user role. Create all necessary components for the user interface and task interactions. Replace any existing code in the codebase to transform it into a fully-featured Airbnb maintenance management application.

Key points to implement:

1. Create a login component with role-based authentication
2. Implement a dashboard for each user role (Inspector, Administrator, Handyman)
3. Develop a problem reporting form for Inspectors with photo upload capability
4. Create a Kanban board component for Administrators to manage tasks
5. Implement a task list and detail view for Handymen
6. Develop a real-time notification system for updates across all user roles
7. Implement API calls to the backend, handling all required parameters for each feature
8. Create a robust error handling system with specific error messages for different types of failures (e.g., API errors, network issues)
9. Implement a property management interface for Administrators
10. Develop a reporting and analytics dashboard for Administrators
11. Create a profile management interface for all user roles
12. Ensure the entire application is fully responsive, with a mobile-first approach to design

Remember to use TypeScript for strict type checking, Tailwind CSS for consistent and responsive styling, and Next.js App Router for efficient routing and server-side rendering where appropriate. Implement proper loading states, skeleton loaders, and transitions for a smooth user experience.

Specific Components to Develop:

1. AuthenticationForm
2. Dashboard (for each user role)
3. ProblemReportingForm
4. KanbanBoard
5. TaskList and TaskDetailView
6. NotificationCenter
7. PropertyManagement
8. ReportingDashboard
9. ProfileManagement
10. Header and Footer
11. Sidebar Navigation

Additional Considerations:

1. Implement data caching strategies for improved performance
2. Use React Context for global state management (e.g., authentication state, notifications)
3. Incorporate accessibility features throughout the application
4. Implement proper data validation on all forms
5. Use optimistic UI updates for a snappy user experience
6. Incorporate proper security measures, especially for role-based access control
7. Implement a theme system for potential white-labeling of the application

When developing components, ensure they are modular, reusable, and well-documented. Use TypeScript interfaces for prop types and API response types. Implement unit tests for critical functionality using a testing library like Jest and React Testing Library.