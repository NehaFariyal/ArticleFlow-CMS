# ArticleFlow CMS

A collaborative, full-stack Content Management System for creating, reviewing, publishing, discovering, and interacting with digital content.

The project includes article management, user authentication, quizzes, administrative verification, notifications, discussions, content moderation, and other content-management capabilities. The team is extending the existing application with additional analytics, discovery, and AI-assisted features.

## Project Overview

ArticleFlow CMS is being developed collaboratively using React, Vite, Node.js, Express, and MongoDB.

The platform supports different user roles and content workflows. Users can interact with articles and quizzes, while authorized administrators can review and manage submitted content.

The current repository contains the existing application. Additional modules listed below are planned development work and should be considered complete only after implementation, integration, and testing.

## Objectives

- Maintain secure authentication and role-based access.
- Support article creation, editing, review, and publishing.
- Provide quizzes, quiz attempts, and results.
- Enable content discovery, search, and browsing.
- Support notifications, comments, and discussions.
- Improve content discovery through trending topics and recommendations.
- Provide useful analytics and AI-assisted content tools.
- Encourage collaborative development through Git and GitHub.

## Existing Application Capabilities

The current backend includes routes for the following areas:

- User authentication and profiles
- Article management
- Administrative content verification
- Quiz management and quiz attempts
- Notifications and comments
- Subscriptions and messaging
- Content reports and appeals
- Content quality and duplicate detection
- Content moderation and spam/abuse detection
- User trust and reputation

The availability and completeness of individual features should be verified against the running application.

## Planned Development Modules

### 1. Frontend Redesign and Sidebar Navigation
- Replace the existing top navigation with a sidebar.
- Improve layout consistency, responsiveness, and usability.
- Refine cards, forms, search interfaces, and page layouts.
- Preserve existing routes and working functionality.

### 2. AI-Powered Trending Articles
- Identify popular articles using available engagement data.
- Consider views, likes, shares, comments, and recent activity where supported.
- Explain why an article is trending.

### 3. Personalized Article Recommendations
- Develop a “For You” section.
- Use available reading history, interests, and article categories.
- Explain why an article is recommended.

### 4. Topic and Trend Detection
- Identify popular topics, keywords, and categories.
- Use recent article activity and engagement where available.
- Present useful summaries of current content trends.

### 5. Author Performance Analytics
- Display available article views, likes, shares, comments, and engagement metrics.
- Help authors identify their better-performing articles and topics.
- Use existing data wherever possible rather than duplicating tracking systems.

### 6. Smart Article Search and Related Articles
- Improve searching by keyword, topic, and category.
- Add relevant article suggestions based on content similarity.
- Connect related articles through smart linking.

### 7. AI Content Assistance and Freshness Alerts
- Suggest improvements to article titles, summaries, tags, and readability.
- Generate article summaries and key takeaways.
- Flag potentially outdated content.
- Check for broken links where technically feasible.

AI integrations should reuse existing project services when appropriate. If an external API is unavailable, provide a clear fallback or error message rather than breaking the application.

### 8. Testing, Debugging, and Integration
- Test existing features and newly developed modules.
- Identify and fix integration issues.
- Verify authentication, authorization, API responses, and frontend workflows.
- Prepare the final project demonstration and presentation.

## Technology Stack

**Frontend**
- React
- Vite
- JavaScript
- HTML5 and CSS3
- React Router
- Axios
- Tailwind CSS

**Backend**
- Node.js
- Express.js
- REST APIs
- Socket.IO

**Database**
- MongoDB
- Mongoose
- MongoDB Atlas when configured

**Authentication and Security**
- JSON Web Tokens (JWT)
- Password hashing with bcryptjs
- Role-based access controls where implemented

**Development Tools**
- Git and GitHub
- Visual Studio Code
- npm
- MongoDB Atlas
- Postman or another API testing tool

## Project Structure

```text
ArticleFlow-CMS/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── src/
│   └── package.json
├── public/
├── server.js
├── package.json
├── package-lock.json
├── .env.example
├── .gitignore
└── README.md
```

This is a high-level overview. The actual files and subdirectories may vary as development progresses.

## Prerequisites

Install the following before running the project:

- Node.js and npm
- Git
- A MongoDB connection, such as MongoDB Atlas, if required by the selected configuration
- Visual Studio Code or another code editor

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/Rushikesh-Pitambare/ArticleFlow-CMS.git
cd ArticleFlow-CMS
```

### 2. Install dependencies

Install the root and backend dependencies:

```bash
npm install
```

Install the frontend dependencies:

```bash
cd frontend
npm install
cd ..
```

### 3. Configure environment variables

Review `.env.example` in the project root.

Create the environment file in the location supported by your configuration, and populate the required variables with your own development values.

The backend loads environment variables from `backend/.env` and can also load `.env` from the working directory.

Depending on the features enabled, configuration may include database connection details, a JWT secret, a server port, and an AI service API key.

Do not commit `.env` files, passwords, API keys, JWT secrets, or database credentials to GitHub. Never share personal credentials with other team members.

### AI writing assistance and summaries

The article editor provides alternative titles, short summaries, tag ideas, readability tips, key takeaways, and a separate long-form summary. These authenticated endpoints use Gemini when configured and otherwise return clearly labeled rule-based or extractive suggestions.

To enable Gemini:

1. Open [Google AI Studio API keys](https://aistudio.google.com/apikey), sign in, and create or select a Google Cloud project.
2. Create an API key for the Gemini API and copy it privately. Do not paste it into chat, source code, or frontend environment variables.
3. From the project root, create the private environment file:

```powershell
Copy-Item backend\.env.example backend\.env
notepad backend\.env
```

Set `GEMINI_API_KEY` in `backend/.env` and save the file:

```env
GEMINI_API_KEY=your_gemini_api_key
# Optional; defaults to gemini-3.5-flash-lite
GEMINI_MODEL=gemini-3.5-flash-lite
```

The key is only read by the backend and must not use a `VITE_` prefix or be placed in frontend files. `backend/.env` is excluded from Git. Restart the backend after changing the environment file; startup logs confirm only whether Gemini is configured, never the key itself. Without the key, the writing assistant and summaries remain available with an on-screen explanation that their results are rule-based rather than AI-generated.

For persistent article storage, configure `MONGODB_URI` in `backend/.env` with your own MongoDB connection string. The server can start without MongoDB and includes limited in-memory demo fallbacks, but that data is temporary and is lost when the backend restarts. The stateless AI endpoints themselves do not require MongoDB. No database credentials are included in this project.

Article create, edit, submit, publish, and other write requests now wait for a MongoDB connection and return an explicit `503` instead of buffering until timeout. To enable persistent saves, create a cluster in [MongoDB Atlas](https://www.mongodb.com/atlas/database), create a database user, allow your development IP under Network Access, and copy the application connection string using **Connect → Drivers**. Put the full private URI in `backend/.env` as `MONGODB_URI=<your-private-connection-string>` (or use the `MONGO_URI` alias), replace the username/password and hostname with the values from your Atlas account, and URL-encode reserved characters in the password. To preserve existing CMS data, the backend explicitly connects to the `content_management_system` database regardless of the URI path. Never leave a sample hostname such as `your_cluster_host`, commit, or share the connection string. The backend logs only a redacted failure category (for example, authentication, IP access, DNS/network, or unavailable cluster). If the database is unavailable, article writes return a clear `503` and do not claim the article was saved.

For stable local authentication, also set `JWT_SECRET` in `backend/.env` to a random secret. Without it, non-production startup generates a temporary secret and warns that sessions will expire on restart. For example, generate a value in PowerShell with:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy that output into `backend/.env` as `JWT_SECRET=<generated-value>`. MongoDB must be configured for permanent accounts. If no database URI is provided in development, registration explicitly reports that accounts only last for the current backend session; if MongoDB is configured but disconnected, registration stops instead of claiming an account was saved.

### 4. Start the application

From the project root, run:

```bash
npm run dev
```

This starts the backend and frontend development processes together.

### Alternative commands

Start only the backend:

```bash
npm run backend
```

Start only the frontend:

```bash
npm run frontend
```

The backend uses port `5000` by default unless another `PORT` value is configured.

### 5. Verify the backend

Open this URL in your browser:

http://localhost:5000/api/health

A successful response should indicate that the API is online.

The frontend's local URL will be displayed by Vite in the terminal. Use that URL to open the application.

**Note:** An online API response does not necessarily mean the database is connected or every feature is working. Verify the server logs and test the required workflows.

## Testing and Build

Run backend tests from the project root:

```bash
npm test
```

Build the frontend for production:

```bash
cd frontend
npm run build
```

These commands may expose existing failures that need to be resolved during integration.

## GitHub Collaboration Guidelines

All contributors should work through the shared GitHub repository.

### Workflow

1. Pull the latest changes from `main`.
2. Create a separate branch for your assigned module.
3. Implement and test your changes locally.
4. Commit your changes with a meaningful message.
5. Push your feature branch to GitHub.
6. Open a pull request targeting `main`.
7. Request a review and resolve feedback before merging.

### Branch naming examples

```text
feature/ui-sidebar
feature/trending-articles
feature/personalized-recommendations
feature/topic-detection
feature/author-analytics
feature/smart-search-related
feature/ai-content-tools
qa/testing-integration
```

Use the branch name agreed upon with the project captain if a different name has been assigned.

### Important rules

- Do not push directly to `main` unless explicitly authorized.
- Do not overwrite or remove another contributor's work.
- Avoid committing `node_modules`, environment files, secrets, or generated build output.
- Coordinate changes to shared models, API routes, and components before implementation.
- Keep existing authentication, authorization, article workflows, and quiz functionality working.
- Test your changes before opening a pull request.
- Inform the project captain about blockers and integration conflicts early.
- Do not merge unreviewed code into the shared branch.

## Team Coordination

The project captain coordinates module assignments, tracks progress, reviews integration status, and communicates with contributors.

Development work should follow the finalized task distribution. The designated testing and integration contributor should coordinate with developers to identify bugs, verify combined functionality, and prepare the demonstration.

**Target project deadline:** Friday, 23 October 2026.

Contributors should communicate progress and blockers regularly so that integration and testing can be completed before the deadline.

## Contribution Expectations

Each contributor is expected to:

- Work on the assigned module.
- Follow the existing project architecture where practical.
- Keep changes focused and maintainable.
- Test relevant workflows.
- Document any new environment variables or setup requirements.
- Update the README when their changes introduce significant setup or usage differences.
- Coordinate with other contributors before changing shared interfaces.

## License

No new license is declared by this README. Check the repository's existing license and obtain the appropriate approval before adding or changing licensing terms.