# Team Task Manager
A full-stack team task management web application built with **Next.js**, **Better Auth**, **Neon PostgreSQL**, **Drizzle ORM**, **shadcn/ui**, and **Tailwind CSS**.
The app allows users to create projects, manage team members, assign tasks, track progress, and use role-based permissions for Admin and Member users.
---
## Table of Contents
- [Overview](#overview)
- [Live Demo](#live-demo)
- [Project Purpose](#project-purpose)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Application Pages](#application-pages)
- [Role-Based Access Control](#role-based-access-control)
- [Database Design](#database-design)
- [REST API Routes](#rest-api-routes)
- [Authentication](#authentication)
- [Dashboard Functionality](#dashboard-functionality)
- [Project Management](#project-management)
- [Task Management](#task-management)
- [Team Management](#team-management)
- [Settings Page](#settings-page)
- [Responsive Design](#responsive-design)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [Database Commands](#database-commands)
- [Build Commands](#build-commands)
- [Deployment](#deployment)
- [Demo Accounts](#demo-accounts)
- [Demo Video Guide](#demo-video-guide)
- [Assessment Requirements Covered](#assessment-requirements-covered)
- [Future Improvements](#future-improvements)
---
## Overview
**Team Task Manager** is a full-stack project and task management platform designed for small teams. Users can sign up, create projects, invite other users to projects, assign roles, create tasks, assign tasks to members, update task progress, and monitor overall progress through a dashboard.
The application uses project-level role-based access control. Each project has members, and every member has either an **Admin** or **Member** role.
The app is built with a modern full-stack TypeScript stack and includes REST API routes, database relationships, server-side data fetching, protected routes, and a responsive user interface.

## Project Purpose

This project was created for a full-stack web development assessment.

The goal was to build a web application where users can:

* Create projects
* Manage project teams
* Create and assign tasks
* Track task status
* View dashboard progress
* Use Admin and Member permissions
* Deploy the app as a live working project

---

## Key Features

### Authentication

* User signup
* User login
* User logout
* Protected dashboard routes
* Session-based authentication using Better Auth

### Project Management

* Create projects
* View all accessible projects
* View individual project details
* Edit project name, description, and status
* Delete projects as an Admin
* Automatically assign project creator as Admin

### Team Management

* Add members to a project by email
* Assign members as Admin or Member
* Remove members from a project
* View all team members across accessible projects
* Role badges for Admin and Member users

### Task Management

* Create tasks inside projects
* Assign tasks to project members
* Set task status
* Set task priority
* Set task due date
* Delete tasks as an Admin
* Update task status
* View all tasks across accessible projects

### Dashboard

* Total project count
* Total task count
* In-progress task count
* Completed task count
* Overdue task count
* Recent tasks
* Completion rate summary

### Settings

* View account details
* Edit display name
* View project access summary
* View assigned task summary
* View system details for authentication, database, and ORM
* Demo checklist for assessment presentation

### UI and UX

* Clean dashboard-style interface
* shadcn/ui components
* Tailwind CSS styling
* Responsive layout
* Sidebar navigation
* Mobile menu
* Custom confirmation modals
* Consistent buttons, inputs, selects, and cards

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js App Router |
| Language | TypeScript |
| Authentication | Better Auth |
| Database | Neon PostgreSQL |
| ORM | Drizzle ORM |
| UI Library | shadcn/ui |
| Styling | Tailwind CSS |
| Validation | Zod |
| Icons | lucide-react |
| Deployment | Railway |
| Package Manager | pnpm |

---

## Application Pages

| Route | Description |
|---|---|
| `/` | Landing page |
| `/signup` | User signup page |
| `/login` | User login page |
| `/dashboard` | Main dashboard with real project and task statistics |
| `/projects` | List of projects the user belongs to |
| `/projects/new` | Create a new project |
| `/projects/[projectId]` | Project details, members, and tasks |
| `/tasks` | All tasks across accessible projects |
| `/team` | Overview of members across accessible projects |
| `/settings` | Account settings, profile editing, access summary, and demo checklist |

---

## Role-Based Access Control

The app uses project-level role-based access control.

Each user can have a different role in each project.

### Admin Role

Admins can:

* View the project
* Edit project details
* Delete the project
* Add members
* Remove members
* Create tasks
* Assign tasks
* Delete tasks
* Update task status
* Manage project progress

### Member Role

Members can:

* View projects they belong to
* View tasks in those projects
* Update the status of tasks assigned to them

Members cannot:

* Delete projects
* Add members
* Remove members
* Delete tasks
* Manage other users

---

## Database Design

The application uses Neon PostgreSQL with Drizzle ORM.

### Main Tables

* `user`
* `session`
* `account`
* `verification`
* `projects`
* `project_members`
* `tasks`
* `task_comments`

### Main Relationships

User -> Project Members -> Projects -> Tasks

#### `users`

Stores user account information.

Important fields:
* `id`
* `name`
* `email`
* `emailVerified`
* `image`
* `createdAt`
* `updatedAt`

#### `projects`

Stores project information.

Important fields:
* `id`
* `name`
* `description`
* `status`
* `ownerId`
* `createdAt`
* `updatedAt`

Project statuses:
* active
* completed
* archived

#### `project_members`

Connects users to projects and stores their project role.

Important fields:
* `id`
* `projectId`
* `userId`
* `role`
* `createdAt`

Roles:
* admin
* member

#### `tasks`

Stores project tasks.

Important fields:
* `id`
* `projectId`
* `title`
* `description`
* `status`
* `priority`
* `assignedToId`
* `createdById`
* `dueDate`
* `createdAt`
* `updatedAt`

Task statuses:
* todo
* in_progress
* review
* done

Task priorities:
* low
* medium
* high
* urgent

#### `task_comments`

A table prepared for task comments.

Important fields:
* `id`
* `taskId`
* `userId`
* `content`
* `createdAt`

---

## REST API Routes

The app includes REST API routes for projects, tasks, members, and settings.

### Authentication

Authentication is handled through Better Auth:

`[POST, GET] /api/auth/[...all]`

### Projects API

```http
GET    /api/projects
POST   /api/projects
GET    /api/projects/[projectId]
PATCH  /api/projects/[projectId]
DELETE /api/projects/[projectId]
```

### Tasks API

```http
GET    /api/tasks?projectId=...
POST   /api/tasks
GET    /api/tasks/[taskId]
PATCH  /api/tasks/[taskId]
DELETE /api/tasks/[taskId]
```

### Members API

```http
GET    /api/projects/[projectId]/members
POST   /api/projects/[projectId]/members
DELETE /api/projects/[projectId]/members?memberId=...
```

### Settings API

```http
PATCH /api/settings/profile
```

---

## Authentication

Authentication is implemented using Better Auth.

The app supports:

* Email and password signup
* Email and password login
* Logout
* Session protection
* Protected routes

Protected pages check for a valid user session before rendering. If no session exists, the user is redirected to the login page.

---

## Dashboard Functionality

The dashboard uses real database data from the logged-in user’s accessible projects.

It shows:

* Number of projects the user belongs to
* Total number of tasks across those projects
* Number of in-progress tasks
* Number of completed tasks
* Number of overdue tasks
* Recent tasks
* Completion rate

This gives users a quick overview of current project progress.

---

## Project Management

Users can create projects from the Projects page.

When a project is created:

1. A new project record is inserted into the database.
2. The creator is automatically added to `project_members`.
3. The creator receives the admin role.

Admins can edit:

* Project name
* Project description
* Project status

Admins can also delete projects. Deleting a project also removes related members and tasks through database relationships.

---

## Task Management

Tasks are created inside projects.

Each task can have:

* Title
* Description
* Status
* Priority
* Assigned user
* Due date

Admins can create, assign, update, and delete tasks.

Members can update the status of tasks assigned to them.

**Task status options:**
* Todo
* In progress
* Review
* Done

**Task priority options:**
* Low
* Medium
* High
* Urgent

---

## Team Management

Team management is handled at project level.

Admins can add a user to a project by email. The user must already have an account.

Admins can choose the user’s role:
* Admin
* Member

The Team page gives a global overview of all members across the projects the logged-in user can access.

---

## Settings Page

The Settings page includes useful account and app information.

Users can:

* View their account name and email
* Edit their display name
* View how many projects they belong to
* View how many projects they manage as Admin
* View assigned task count
* View assigned task completion rate
* View their project access roles
* View system details
* View a demo checklist for assessment presentation

---

## Responsive Design

The app is designed to work on desktop and mobile.

Responsive features include:

* Sidebar layout on desktop
* Mobile menu using a sheet component
* Responsive cards and grids
* Forms that adapt to smaller screens
* Dashboard cards that stack on mobile
* Task and project views that remain usable on narrow screens

---

## Environment Variables

Create a `.env.local` file in the project root.

```env
DATABASE_URL="your-neon-postgres-url"
BETTER_AUTH_SECRET="your-secret"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

For production deployment:

```env
DATABASE_URL="your-neon-postgres-url"
BETTER_AUTH_SECRET="your-secret"
BETTER_AUTH_URL="https://your-live-url"
NEXT_PUBLIC_APP_URL="https://your-live-url"
```

**Important:** Do not commit `.env.local` or `.env` to GitHub.

---

## Installation

Install dependencies:

```bash
pnpm install
```

---

## Running Locally

Start the development server:

```bash
pnpm dev
```

Open: [http://localhost:3000](http://localhost:3000)

---

## Database Commands

Push schema to the database:

```bash
pnpm db:push
```

Generate migrations:

```bash
pnpm db:generate
```

Open Drizzle Studio:

```bash
pnpm db:studio
```

---

## Build Commands

Build the project:

```bash
pnpm build
```

Start the production build locally:

```bash
pnpm start
```

---

## Deployment

This app is intended to be deployed using Railway.

Deployment steps:

1. Push the code to GitHub.
2. Create a Railway project.
3. Connect the GitHub repository.
4. Add the required environment variables.
5. Deploy the app.
6. Update `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` with the Railway live URL.
7. Test signup, login, project creation, and task creation on the deployed app.

---

## Demo Accounts

Create these accounts manually for testing and demonstration.

**Admin Account**
* Name: Demo Admin
* Email: admin@example.com
* Password: password123

**Member Account**
* Name: Demo Member
* Email: member@example.com
* Password: password123

Recommended demo data:

**Project:**
Website Redesign

**Tasks:**
* Design dashboard cards
* Build login flow
* Review overdue tasks
* Prepare launch checklist

---

## Demo Video Guide

A good 2 to 5 minute demo should show:

1. Landing page
2. Login as Admin
3. Dashboard statistics
4. Create a project
5. Edit project status
6. Add a member by email
7. Create a task
8. Assign the task to a member
9. Update task status
10. Show dashboard stats updating
11. Open Team page
12. Open Settings page
13. Logout
14. Login as Member
15. Show limited member permissions
16. Show responsive mobile layout quickly using browser dev tools

---

## Assessment Requirements Covered

| Requirement | Status |
|---|---|
| Authentication | Completed |
| Signup/Login | Completed |
| Project management | Completed |
| Team management | Completed |
| Task creation | Completed |
| Task assignment | Completed |
| Task status tracking | Completed |
| Dashboard | Completed |
| Overdue task tracking | Completed |
| REST APIs | Completed |
| Database | Completed |
| Validations | Completed |
| Relationships | Completed |
| Role-based access control | Completed |
| Responsive UI | Completed |
| Deployment ready | Completed |
| README | Completed |

---

## Future Improvements

Possible future improvements include:

* Email invitations for new members
* Password reset flow
* Task comments UI
* File attachments
* Notifications
* Search and filters for tasks
* Kanban board view
* Drag and drop task status changes
* Activity logs
* Dark mode
* More detailed analytics
* Organisation/workspace support

---

## Author

Created by DavyJonesCodes.

GitHub repository:
[https://github.com/DavyJonesCodes/Team-Task-Manager](https://github.com/DavyJonesCodes/Team-Task-Manager)
