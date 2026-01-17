# Veterinary Chatbot SDK

A comprehensive veterinary chatbot SDK built with MERN stack that can be embedded into any website using a single script tag. The chatbot answers veterinary-related questions and handles appointment booking through conversational AI.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [API Endpoints](#api-endpoints)
- [Architecture Overview](#architecture-overview)
- [Troubleshooting](#troubleshooting)

## Overview

This project is a monorepo built with Turborepo containing:

- **Web App** (`apps/web`) - Admin dashboard for managing appointments and viewing analytics
- **Widget App** (`apps/widget`) - Embeddable chatbot widget that can be integrated into any website
- **Server** (`apps/server`) - Express.js backend API with AI integration
- **Shared Packages** - Reusable packages for auth, database, and environment configuration

### Key Features

- AI-powered veterinary Q&A using OpenAI
- Conversational appointment booking flow
- Real-time chat interface with streaming responses
- Admin dashboard with appointment management
- Authentication with Better Auth
- Embeddable chatbot widget (single script tag integration)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **pnpm** (v10.28.0 or higher) - Package manager
- **MongoDB** - Database (local or cloud instance)
- **OpenAI API Key** - For AI chat functionality

### Installing pnpm

If you don't have pnpm installed:

```bash
npm install -g pnpm@10.28.0
```

## Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd veterinary-chabot
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Copy environment variable examples**

```bash
# Copy .env.example files to .env in each app
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env
cp apps/widget/.env.example apps/widget/.env
```

4. **Update environment variables**

Edit the `.env` files in each app directory with your actual values (see Environment Variables section below).

## Environment Variables

This project uses environment variables managed through the `@veterinary-app/env` package. `.env.example` files are provided in each app directory as templates.

### Server Environment Variables (`apps/server/.env`)

```env
DATABASE_URL=mongodb://localhost:27017/veterinary-chatbot
BETTER_AUTH_SECRET=your-secret-key-minimum-32-characters-long-for-security
BETTER_AUTH_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3001
OPENAI_API_KEY=sk-your-openai-api-key-here
NODE_ENV=development
```

**Important Notes:**
- `BETTER_AUTH_SECRET` must be at least 32 characters long
- `DATABASE_URL` should point to your MongoDB instance
- `CORS_ORIGIN` should match your web app URL
- `OPENAI_API_KEY` is required for AI chat functionality

### Web App Environment Variables (`apps/web/.env`)

```env
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
NEXT_PUBLIC_WIDGET_URL=http://localhost:3002
```

### Widget App Environment Variables (`apps/widget/.env`)

```env
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

## Database Setup

This project uses MongoDB with Mongoose for data persistence.

### Local MongoDB Setup

1. **Install MongoDB** (if not already installed)
   - macOS: `brew install mongodb-community`
   - Linux: Follow [MongoDB installation guide](https://www.mongodb.com/docs/manual/installation/)
   - Windows: Download from [MongoDB website](https://www.mongodb.com/try/download/community)

2. **Start MongoDB service**

```bash
# macOS/Linux
brew services start mongodb-community

# Linux (systemd)
sudo systemctl start mongod

# Windows
net start MongoDB
```

3. **Verify MongoDB is running**

```bash
mongosh
```

### MongoDB Atlas (Cloud) Setup

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string and update `DATABASE_URL` in `apps/server/.env`

### Database Schema

The application automatically creates the following collections:
- `user` - User accounts
- `session` - Authentication sessions
- `account` - OAuth accounts
- `verification` - Email verification tokens
- `vet_chatbot_session` - Chatbot conversation sessions
- `message` - Chat messages

No manual schema migration is required - Mongoose handles schema creation automatically.

## Running the Project

### Development Mode

Run all applications simultaneously:

```bash
pnpm run dev
```

This will start:
- **Server**: http://localhost:3000
- **Web App**: http://localhost:3001
- **Widget**: http://localhost:3002

### Run Individual Applications

```bash
# Run only the server
pnpm run dev:server

# Run only the web app
pnpm run dev:web
```

### Production Build

```bash
# Build all applications
pnpm run build

# Start server in production mode
cd apps/server
pnpm start
```

## Project Structure

```
veterinary-chabot/
├── apps/
│   ├── web/                    # Admin dashboard (Next.js)
│   ├── server/                 # Backend API (Express)
│   ├── widget/                 # Embeddable chatbot widget (Next.js)
│   └── html/                   # Example HTML integration
├── packages/
│   ├── auth/                   # Authentication package
│   ├── db/                     # Database package
│   ├── env/                    # Environment variables package
│   └── config/                 # Shared TypeScript config
├── package.json
├── turbo.json
└── README.md
```

## Available Scripts

### Root Level Scripts

```bash
pnpm run dev              # Start all apps in development mode
pnpm run dev:web          # Start only web app
pnpm run dev:server       # Start only server
pnpm run build           # Build all applications
pnpm run check-types      # Check TypeScript types across all apps
```

## API Endpoints

### Authentication

- `POST /api/auth/sign-up` - User registration
- `POST /api/auth/sign-in` - User login
- `POST /api/auth/sign-out` - User logout
- `GET /api/auth/session` - Get current session

### Sessions

- `POST /api/session/create` - Create a new chatbot session
  - Body: `{ clinicId, userName?, petName?, source? }`
  - Returns: `{ sessionId, userId }`

### Chat

- `POST /api/chat` - Send a chat message
  - Body: `{ messages: UIMessage[], sessionId: string }`
  - Returns: Streaming response

- `GET /api/chat/history/:sessionId` - Get chat history
  - Returns: `{ messages: Message[] }`

### Appointments

- `GET /api/appointments?clinicId=<id>` - Get all appointments for a clinic
  - Returns: `{ appointments: Appointment[] }`

- `GET /api/appointments/stats?clinicId=<id>` - Get dashboard statistics
  - Returns: `{ totalSessions: number, totalAppointments: number }`

## Architecture Overview

### Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Backend**: Express.js, Node.js
- **Database**: MongoDB with Mongoose
- **AI**: OpenAI API (GPT-4o-mini)
- **Authentication**: Better Auth
- **Monorepo**: Turborepo
- **Package Manager**: pnpm

### Basic Architecture

```
┌─────────────┐
│   Widget    │ (Embeddable chatbot - Port 3002)
│  (Next.js)  │
└──────┬──────┘
       │
       │ HTTP Requests
       │
┌──────▼──────┐
│   Server    │ (Express API - Port 3000)
│  (Node.js)  │
└──────┬──────┘
       │
       ├──────────────┐
       │              │
┌──────▼──────┐  ┌───▼────────┐
│  MongoDB    │  │  OpenAI    │
│  Database   │  │   API      │
└─────────────┘  └────────────┘

┌─────────────┐
│  Web App    │ (Admin Dashboard - Port 3001)
│  (Next.js)  │
└─────────────┘
```

### Key Decisions & Trade-offs

1. **Session Storage in LocalStorage**
   - **Decision**: Widget uses localStorage to store session IDs instead of requiring user authentication
   - **Rationale**: Allows anonymous users to interact with the chatbot without creating accounts, improving user experience and reducing friction
   - **Trade-off**: Sessions are tied to browser/device, but this is acceptable for a chatbot use case

2. **AI SDK for Streaming**
   - **Decision**: Used Vercel AI SDK for streaming responses from backend to frontend
   - **Rationale**: Provides real-time chat experience with progressive message rendering
   - **Trade-off**: Requires maintaining connection during streaming, but significantly improves UX

3. **Bubble Embed Widget**
   - **Decision**: Widget implemented as a floating bubble that can be embedded via single script tag
   - **Rationale**: Easy integration for website owners, no complex setup required
   - **Trade-off**: Less customizable than full-page integration, but meets the requirement for simple embedding

4. **One-to-One Appointment Relationship**
   - **Decision**: Each chatbot session can have at most one embedded appointment
   - **Rationale**: Simplifies data model and prevents duplicate bookings per session
   - **Trade-off**: Users need to start a new session to book another appointment, but this prevents confusion

5. **Monorepo Structure**
   - **Decision**: Used Turborepo for managing multiple apps and shared packages
   - **Rationale**: Code reusability, shared types, efficient builds
   - **Trade-off**: Slightly more complex setup, but better long-term maintainability

6. **No Authentication for Widget Users**
   - **Decision**: Widget users don't need to authenticate to use the chatbot
   - **Rationale**: Reduces friction and allows immediate interaction
   - **Trade-off**: Cannot track users across devices, but acceptable for anonymous chatbot use

### Assumptions

1. **Admin Authentication**: Only clinic admins need authentication (via web app)
2. **Anonymous Users**: Widget users can interact anonymously without accounts
3. **Session Persistence**: Sessions stored in localStorage are sufficient for widget functionality
4. **Single Appointment per Session**: One appointment per conversation session is acceptable
5. **OpenAI API**: OpenAI API is available and has sufficient rate limits for production use
6. **MongoDB**: MongoDB instance is accessible and properly configured

### Future Improvements

1. **User Authentication for Widget**
   - Add optional authentication for widget users to enable cross-device session persistence
   - Allow users to view their chat history across devices

2. **Chat History Storage**
   - Implement persistent chat history storage for widget users
   - Add ability to resume previous conversations

3. **Enhanced Admin Panel**
   - Add more analytics and reporting features
   - Implement appointment status management (confirm, cancel, reschedule)
   - Add user management and clinic settings
   - Export appointments to CSV/PDF
   - Add filtering and search capabilities for appointments

4. **Additional Features**
   - Email notifications for appointments
   - SMS reminders for upcoming appointments
   - Multi-language support
   - Customizable chatbot personality and responses
   - Integration with calendar systems

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Change ports in respective `package.json` files or kill the process using the port

2. **MongoDB Connection Error**
   - Verify MongoDB is running: `mongosh`
   - Check `DATABASE_URL` in `apps/server/.env`

3. **Environment Variable Errors**
   - Ensure all required env variables are set
   - Check that `BETTER_AUTH_SECRET` is at least 32 characters
   - Verify `.env` files exist in each app directory

4. **OpenAI API Errors**
   - Verify your API key is valid and has credits
   - Check rate limits

5. **Widget Not Loading**
   - Check that widget app is running on port 3002
   - Verify `NEXT_PUBLIC_WIDGET_URL` is correctly set
   - Check browser console for errors
