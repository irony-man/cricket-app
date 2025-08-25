
# Cricket Commentary App

This project is a real-time cricket commentary application with a NestJS backend and a Next.js frontend. It uses WebSockets to deliver live updates.

## Getting Started

Follow these instructions to get both the backend and frontend services running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v18 or later recommended)
* [npm](https://www.npmjs.com/) (usually comes with Node.js)
* [MongoDB](https://www.mongodb.com/try/download/community)
* [Redis](https://redis.io/docs/getting-started/installation/)

---

## Backend Setup (NestJS)

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the `backend` directory by copying the example file:
    ```bash
    cp .env.example .env
    ```
    Make sure the `MONGO_URI` and `REDIS` variables in the `.env` file point to your local instances.

4.  **Start the backend server:**
    The server will start in watch mode, automatically restarting on file changes.
    ```bash
    npm run start:dev
    ```
    The backend API will be running at `http://localhost:3000`.

---

## Frontend Setup (Next.js)

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the frontend development server:**
    ```bash
    npm run dev
    ```
    The frontend application will be available at `http://localhost:3001`. You can view the main commentary page at this URL and the admin panel at `http://localhost:3001/admin`.

---

## API Endpoints (cURL Examples)

Here are some cURL examples for testing the API endpoints directly.

### Create a Team

```bash
curl -X POST http://localhost:3000/teams \\
-H "Content-Type: application/json" \\
-d '{
  "name": "India",
  "short_name": "IND"
}'
```

### Create a Player

```bash
curl -X POST http://localhost:3000/players \\
-H "Content-Type: application/json" \\
-d '{
  "name": "Virat Kohli",
  "short_name": "V Kohli",
  "role": "BATSMAN",
  "teams": [1001]
}'
```
*Note: Replace `1001` with a valid `teamId` that exists in your database.*

### Start a Match

```bash
curl -X POST http://localhost:3000/matches/start \\
-H "Content-Type: application/json" \\
-d '{
  "teams": [1001, 1002],
  "toss": {
    "winner": 1001,
    "decision": "BAT"
  }
}'
```
*Note: Replace `1001` and `1002` with valid `teamId`s.*

### Add Commentary

```bash
curl -X POST http://localhost:3000/matches/1001/commentary \\
-H "Content-Type: application/json" \\
-d '{
  "teamId": 1001,
  "striker": 2001,
  "non_striker": 2002,
  "bowler": 2003,
  "inning": 1,
  "over": 5,
  "ball": 2,
  "eventType": "4 runs, beautiful shot through the covers!"
}'