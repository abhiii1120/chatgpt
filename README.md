# Cove — Full-Stack AI Chat Assistant

An intelligent, full-stack conversational AI platform built with **React 19**, **Express 5**, **TypeScript**, **LangChain**, and **Mistral AI**. Featuring real-time response streaming, autonomous agent tool calling (long-term memory & live web search), enterprise-grade dual-token authentication, and a sleek dark-themed UI.

---

## 📑 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
  - [Running with Docker](#running-with-docker)
- [AWS Cloud Deployment](#-aws-cloud-deployment)
  - [Cloud Architecture Overview](#cloud-architecture-overview)
  - [AWS Services Used](#aws-services-used)
  - [Deployment Workflow](#deployment-workflow)
  - [Auto Scaling & Load Balancing Configuration](#auto-scaling--load-balancing-configuration)
- [Testing](#testing)
- [Security & Authentication](#security--authentication)

---

## 🌟 Overview

**Cove** provides a complete end-to-end ChatGPT-like conversational experience powered by:
- **Mistral AI (`ministral-14b-2512`)** via LangChain.
- **Autonomous Agent Tools**: The assistant can search the live web using Tavily Search API and store persistent long-term memory about the user across conversations.
- **Streaming Responses**: Token-by-token Server-Sent Events (SSE) streaming for fast, interactive chat responses.
- **Robust Session Security**: Dual-token JWT authentication (in-memory access token + HTTP-only cookie refresh token with database-backed token rotation).
- **High-Availability Cloud Hosting**: Production-ready deployment on **AWS** using **Amazon ECS**, **ECR**, **Application Load Balancer (ALB)**, and **Auto Scaling Target Groups**.

---

## ✨ Key Features

### 🤖 Intelligent AI Agent & Tools
- **LangChain ReAct Agent**: Coordinates responses with automatic tool calling.
- **Persistent Long-Term Memory**: Autonomous memory extraction tool (`getMemoryTool`, `updateMemoryTool`) remembers personal user details and preferences across sessions.
- **Real-Time Web Search**: Integrates **Tavily AI Search** (`getWebResultTool`) to fetch up-to-date real-world facts and news when answering queries.
- **Automatic Title Generation**: Automatically summarizes the first user prompt into a concise conversation title using Zod structured output.
- **LangSmith Tracing**: Integrated with LangSmith for observability, debugging, and tracing agent execution graphs.

### 💬 Rich Chat Experience
- **Server-Sent Events (SSE) Streaming**: Low-latency typing stream with real-time markdown parsing.
- **Markdown & Code Rendering**: Full formatting support via `react-markdown` and `remark-gfm` (code blocks, tables, blockquotes, lists).
- **Keyboard Shortcuts**: Press `Enter` to send, and `Shift + Enter` to insert a newline.
- **Sidebar & History**: Create new chats, browse conversation history, and switch between active sessions smoothly.
- **Profile Page**: Dedicated user profile portal displaying user details, account ID, verified status, and live profile data refresh.

### 🔒 Enterprise-Grade Authentication
- **Dual-Token Architecture**:
  - Short-lived Access Token (`15m`) stored safely in memory.
  - Long-lived Refresh Token (`7d`) stored in an `httpOnly`, `SameSite=lax` secure cookie.
- **Token Rotation & Revocation**: Every token refresh generates a new session and revokes the old one, preventing replay attacks.
- **Transparent Refresh Queue**: Client-side Axios interceptor queues simultaneous failed requests and refreshes tokens without duplicate network calls.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Description |
| :--- | :--- |
| **React 19** | Modern UI library with latest concurrent features |
| **Vite 8** | Ultra-fast frontend bundler and development server |
| **Redux Toolkit (RTK)** | Predictable global state management (`authSlice`, `sessionSlice`) |
| **React Router v7** | Declarative client-side routing with nested & protected layouts |
| **Tailwind CSS v4** | Utility-first CSS engine with dark glassmorphic styling |
| **React Hook Form** | Performant, flexible form validation |
| **React Markdown + Remark GFM** | GitHub-flavored markdown and syntax highlighting |
| **Axios** | HTTP client configured with automated refresh token interceptors |

### Backend & AI
| Technology | Description |
| :--- | :--- |
| **Node.js (ESM)** | Modern JavaScript runtime with native ECMAScript modules |
| **TypeScript** | Strongly-typed application logic and interface validation |
| **Express 5** | High-performance, scalable web server framework |
| **MongoDB & Mongoose** | Document database for users, sessions, conversations, and memory |
| **LangChain** | Agent workflow orchestration, tool calling, and streaming |
| **Mistral AI** | Large language model provider (`ministral-14b-2512`) |
| **Tavily AI** | Real-time web search API for LLM agents |
| **JSON Web Tokens & Bcrypt** | Secure password hashing and cryptographic token signing |
| **Zod & Express Validator** | Request payload validation and schema enforcement |
| **Jest & Supertest** | Automated unit and integration testing suite |

### Cloud & DevOps (AWS)
| Technology | Description |
| :--- | :--- |
| **Amazon ECR** | Elastic Container Registry for secure Docker image versioning and storage |
| **Amazon ECS (Fargate)** | Serverless container orchestration for highly available task management |
| **AWS ALB** | Application Load Balancer managing SSL/TLS termination and path routing |
| **Target Groups & Auto Scaling**| Dynamic horizontal scaling based on CPU and request traffic thresholds |
| **Docker** | Multi-stage production container build (Node.js 22 Alpine) |

---

## 🏛️ System Architecture

```text
                  +----------------------------------------------+
                  |                 Client (React 19)            |
                  |  Vite + Redux Toolkit + Tailwind CSS v4      |
                  +----------------------+-----------------------+
                                         |
                       HTTP / JSON & SSE | Authorization: Bearer <JWT>
                                         v
                  +----------------------------------------------+
                  |             Backend API (Express 5)          |
                  |        TypeScript + Auth & Validation        |
                  +----------------------+-----------------------+
                                         |
                +------------------------+------------------------+
                |                                                 |
                v                                                 v
   +-------------------------+                       +-------------------------+
   |   MongoDB & Mongoose    |                       |   LangChain AI Agent    |
   | - Users & Passwords     |                       | - Mistral AI LLM        |
   | - Refresh Sessions      |                       | - Memory Context Tool   |
   | - Conversations & Chats |                       | - Tavily Web Search     |
   | - User Long-term Memory |                       | - LangSmith Observability|
   +-------------------------+                       +-------------------------+
```

---

## 📂 Project Structure

```text
chatgpt/
├── client/                               # Frontend React application
│   ├── src/
│   │   ├── app/                          # Routing & root application layouts
│   │   │   ├── layouts/                  # PublicLayout, ProtectedLayout
│   │   │   ├── router.jsx                # Route definitions (/login, /chat, /profile)
│   │   │   └── store.js                  # Redux Toolkit store setup
│   │   ├── features/
│   │   │   ├── auth/                     # Authentication & User Profile
│   │   │   │   ├── hooks/                # useAuth hook
│   │   │   │   ├── service/              # authService (login, register, profile)
│   │   │   │   ├── state/                # authSlice, authThunk
│   │   │   │   └── ui/pages/             # LoginPage, RegisterPage, Profile
│   │   │   └── chat/                     # Chat interface & Conversation state
│   │   │       ├── hooks/                # useChat hook
│   │   │       ├── service/              # chatService (SSE streaming & history)
│   │   │       ├── state/                # sessionSlice, sessionThunk
│   │   │       └── ui/                   # Chat page & MessageContent component
│   │   └── shared/                       # Shared HTTP client, icons, and utilities
│   ├── package.json
│   └── vite.config.js
│
├── server/                               # Backend Node.js / Express application
│   ├── src/
│   │   ├── @types/                       # Express ambient type extensions
│   │   ├── app/                          # Express app configuration & middleware
│   │   ├── config/                       # Database connection & env variables
│   │   ├── controllers/                  # auth.controller.ts, chat.controller.ts
│   │   ├── dao/                          # Data Access Objects (User, Session, Chat, Memory)
│   │   ├── middlewares/                  # authUserMiddleware, asyncHandler, error handling
│   │   ├── models/                       # Mongoose schemas (User, Session, Conversation, Message, Context)
│   │   ├── routes/                       # Express routes (auth.routes.ts, chat.routes.ts)
│   │   ├── services/
│   │   │   ├── ai/                       # AI Agent tools (Memory & Web Search)
│   │   │   └── ai.service.ts             # Mistral AI agent & streaming pipeline
│   │   ├── utils/                        # Crypto, JWT sign/verify, Custom errors
│   │   ├── validations/                  # Express-validator schemas
│   │   └── server.ts                     # Server entry point
│   ├── __test__/                         # Automated test suites
│   ├── package.json
│   └── tsconfig.json
│
├── dockerfile                            # Multi-stage production container build
├── README.md                             # Project documentation
└── .dockerignore
```

---

## 📡 API Reference

All routes are prefixed with `/api/v1`.

### Authentication Endpoints (`/api/v1/auth`)

| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Public | Register a new user (`name`, `email`, `password`) |
| `POST` | `/auth/login` | Public | Authenticate user, set refresh cookie, return access token |
| `POST` | `/auth/refresh` | Cookie / Body | Exchange refresh token for fresh access and refresh tokens |
| `POST` | `/auth/logout` | Public | Revoke active session and clear refresh cookie |
| `GET` | `/auth/profile` | Bearer Token | Fetch authenticated user's profile details (`id`, `name`, `email`) |

### Chat Endpoints (`/api/v1/chat`)

| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/chat/conversations` | Bearer Token | List all conversations for the authenticated user |
| `GET` | `/chat/conversations/:conversationId` | Bearer Token | Retrieve all messages within a specific conversation |
| `POST` | `/chat/conversation` | Bearer Token | Send prompt and receive Server-Sent Events (SSE) AI stream |

---

## 🔑 Environment Variables

Create a `.env` file in the `server/` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/chatgpt

# Authentication Secrets
JWT_ACCESS_SECRET=your_super_secret_access_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=7d
REFRESH_COOKIE_NAME=refreshToken
COOKIE_SECURE=false

# AI Services & Tooling
MISTRAL_API_KEY=your_mistral_api_key
TVLY_API_KEY=your_tavily_search_api_key
LANGSMITH_API_KEY=your_langsmith_api_key
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v20 or v22 recommended)
- [MongoDB](https://www.mongodb.com/) (local instance or MongoDB Atlas)
- API keys for [Mistral AI](https://console.mistral.ai/) and [Tavily](https://tavily.com/)

---

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/abhiii1120/chatgpt.git
   cd chatgpt
   ```

2. **Install Server dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Install Client dependencies:**
   ```bash
   cd ../client
   npm install
   ```

---

### Running Locally

You can run both the server and client concurrently in separate terminals:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```
*The server will start on `http://localhost:5000`.*

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```
*The client will start on `http://localhost:5173` (proxied to `/api/v1` on port 5000).*

---

### Running with Docker

The repository includes a multi-stage `dockerfile` that builds both the client bundle and compiled TypeScript server into a unified production container:

```bash
# Build the Docker image
docker build -t cove-chatgpt .

# Run the container
docker run -p 5000:5000 \
  -e MONGODB_URI="mongodb+srv://..." \
  -e JWT_ACCESS_SECRET="your_secret" \
  -e JWT_REFRESH_SECRET="your_secret" \
  -e MISTRAL_API_KEY="your_mistral_key" \
  -e TVLY_API_KEY="your_tavily_key" \
  -e LANGSMITH_API_KEY="your_langsmith_key" \
  cove-chatgpt
```
*Access the app directly at `http://localhost:5000`.*

---

## ☁️ AWS Cloud Deployment

This project is deployed to **Amazon Web Services (AWS)** using a scalable containerized architecture:

### Cloud Architecture Overview

```text
                           [ Users & Clients ]
                                    │
                                    ▼
                   [ AWS Application Load Balancer (ALB) ]
                     - Public Subnet (Ports 80 / 443)
                     - SSL/TLS Termination via AWS ACM
                                    │
                                    ▼
                        [ ALB Target Group ]
                     - Health Check Probes
                     - Dynamic Port & Task Routing
                                    │
            ┌───────────────────────┴───────────────────────┐
            │               Auto Scaling Group              │
            ▼                                               ▼
   [ Amazon ECS Task 1 ]                          [ Amazon ECS Task 2 ]
   - AWS Fargate / Private Subnet                 - AWS Fargate / Private Subnet
   - Docker Container from Amazon ECR             - Docker Container from Amazon ECR
   - Node 22 Alpine Runtime                       - Node 22 Alpine Runtime
            │                                               │
            └───────────────────────┬───────────────────────┘
                                    │
                     ┌──────────────┴──────────────┐
                     ▼                             ▼
         [ MongoDB Atlas Database ]     [ Mistral & Tavily APIs ]
```

### AWS Services Used

1. **Amazon ECR (Elastic Container Registry)**:
   - Houses private, tagged Docker images produced by the multi-stage Docker build.
   - Integrated with vulnerability scanning to ensure secure image deployments.

2. **Amazon ECS (Elastic Container Service) with AWS Fargate**:
   - Serverless container orchestration running backend API and built static frontend assets.
   - Eliminates EC2 server patching, OS maintenance, and capacity planning.
   
3. **Application Load Balancer (ALB)**:
   - Serves as the single public gateway in public subnets across multiple Availability Zones.
   - Handles SSL/TLS certificate termination via **AWS Certificate Manager (ACM)**.
   - Distributes incoming HTTP/HTTPS traffic to healthy container tasks.

4. **Target Groups & Auto Scaling**:
   - **Health Checks**: ALB periodically queries application health probes to route traffic only to active, healthy containers.
   - **Target Tracking Scaling Policies**: Automatically scales the number of ECS tasks up or down based on metrics:
     - **CPU Utilization**: Scales out when task CPU utilization exceeds 70%.
     - **Request Count Per Target**: Dynamically spins up additional tasks during high chat traffic spikes and scales in during low utilization to optimize cost.

---

### Deployment Workflow

```bash
# 1. Log in to your Amazon ECR Registry
aws ecr get-login-password --region <your-region> | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.<your-region>.amazonaws.com

# 2. Build and tag the multi-stage Docker image
docker build -t cove-chatgpt .
docker tag cove-chatgpt:latest <aws_account_id>.dkr.ecr.<your-region>.amazonaws.com/cove-chatgpt:latest

# 3. Push the image to Amazon ECR
docker push <aws_account_id>.dkr.ecr.<your-region>.amazonaws.com/cove-chatgpt:latest

# 4. Trigger an Amazon ECS Service update / rolling deployment
aws ecs update-service \
  --cluster cove-cluster \
  --service cove-service \
  --force-new-deployment \
  --region <your-region>
```

---

### Auto Scaling & Load Balancing Configuration

| Component | Setting / Metric | Description |
| :--- | :--- | :--- |
| **ALB Listener** | `Port 443 (HTTPS)` / `Port 80 (HTTP)` | Auto-redirects HTTP (80) to HTTPS (443) |
| **Health Check Path** | `/` or `/api/v1` | Verifies container status before routing traffic |
| **Healthy Threshold** | `3 consecutive successes` | Marks new container task ready for traffic |
| **Min Task Capacity** | `2 tasks` (Multi-AZ) | Ensures baseline high availability across zones |
| **Max Task Capacity** | `10 tasks` | Safeguard limit for automatic horizontal scaling |
| **Scaling Policy** | `ECSServiceAverageCPUUtilization > 70%` | Automatically adds tasks when CPU loads increase |

---

## 🧪 Testing

The backend includes automated integration tests using Jest and `mongodb-memory-server`:

```bash
cd server
npm run test
```

---

## 🔐 Security & Best Practices

- **Token Storage**: Access tokens are kept in JavaScript memory (not `localStorage`), protecting against Cross-Site Scripting (XSS) token theft.
- **CSRF Mitigation**: Refresh tokens are stored in `HttpOnly`, `SameSite=Lax` cookies, preventing unauthorized script access.
- **Session Revocation**: Stolen or revoked refresh tokens are invalidated immediately in MongoDB.
- **Input Sanitization**: Request bodies are validated using Zod and Express Validator before hitting business logic.
- **Graceful Error Handling**: Centralized asynchronous error handler captures errors and formats consistent JSON error responses without leaking internal stack traces in production.
- **VPC Isolation**: In AWS, ECS tasks run in private VPC subnets with NAT Gateway egress, accessible only through the public Application Load Balancer.

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).