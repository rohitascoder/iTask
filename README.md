# iTask: Full-Stack Task Management App

A modern, full-stack task management application built with a React frontend and a Flask/SQLite backend. It features user authentication, task creation and management, a responsive design, and a dark mode theme.

## Features

- **User Authentication**: Secure user registration and login using JWT.
- **Task Management**: Create, view, update, and delete tasks.
- **Task Status Tracking**: Track task progress with statuses: Pending, In Progress, Completed.
- **Search Functionality**: Quickly find tasks by title or description.
- **Responsive Design**: A seamless experience across desktop and mobile devices.
- **Dark Mode**: Switch between light and dark themes for user comfort.

## Tech Stack

- **Frontend**:
  - React
  - TypeScript
  - Tailwind CSS
- **Backend**:
  - Flask
  - SQLite (with SQLAlchemy ORM)
  - Flask-RESTful for API creation
  - Flask-Migrate (Alembic) for database migrations
  - Flask-JWT-Extended for authentication

## Backend Setup (Flask & SQLite)

### 1. Prerequisites
- Python 3.8+ and `pip`

### 2. Setup Instructions

1.  **Navigate to the Backend Directory:**
    ```bash
    cd backend
    ```

2.  **Create and Activate a Virtual Environment:**
    *   **macOS / Linux:**
        ```bash
        python3 -m venv venv
        source venv/bin/activate
        ```
    *   **Windows:**
        ```bash
        python -m venv venv
        venv\Scripts\activate
        ```

3.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure Environment Variables:**
    *   In the `backend` directory, create a `.env` file by copying the example:
        ```bash
        cp .env.example .env
        ```
    *   The `DATABASE_URL` is already configured for SQLite. For production, you **must** change `JWT_SECRET_KEY` to a long, random, and secret string.

5.  **Apply Database Migrations:**
    *   Apply the existing database migrations to create the required tables in your `itask.db` file:
        ```bash
        flask db upgrade
        ```
    *   *Note for developers: If you change the database models in `models.py`, you'll need to generate a new migration script (`flask db migrate -m "Your description"`) and then apply it.*

6.  **Seed the Database (Optional):**
    *   To create a default user for testing, run the seed command. This will create a user with credentials `admin` / `admin`.
        ```bash
        flask seed
        ```

7.  **Run the Flask Backend Server:**
    ```bash
    flask run --port=5001
    ```
    The backend API will now be running at `http://127.0.0.1:5001`. The database file `itask.db` will be created in the `backend` directory upon first use.

## Frontend Setup (React)

The frontend is a single-page application built with React and is designed to run in a browser-based development environment.

1.  **API Connection:**
    *   The frontend is pre-configured in `services/api.ts` to connect to the backend API at `http://127.0.0.1:5001`.
    *   Ensure your Flask backend is running on port 5001 as instructed above before using the frontend.

2.  **Running the App:**
    *   With the backend server running, the frontend application should work as expected.
    *   You can register a new user, log in, and begin creating and managing tasks.

## API Endpoints

All endpoints are prefixed with `/api`. Authentication is required for all `/tasks` endpoints, sent via a `Bearer` token in the `Authorization` header.

### Authentication

- `POST /auth/register`
  - **Description**: Registers a new user.
  - **Body**: `{ "name": "username", "email": "user@example.com", "password": "password" }`
  - **Response**: `{ "message": "User created successfully." }`

- `POST /auth/login`
  - **Description**: Logs in a user and returns a JWT token.
  - **Body**: `{ "identity": "username_or_email", "password": "password" }`
  - **Response**: `{ "access_token": "your_jwt_token" }`

### Tasks

- `GET /tasks`
  - **Description**: Retrieves all tasks for the authenticated user.
  - **Response**: `[ { "id": "...", "title": "...", ... }, ... ]`

- `POST /tasks`
  - **Description**: Creates a new task for the authenticated user.
  - **Body**: `{ "title": "Task Title", "description": "Task description" }`
  - **Response**: `{ "id": "...", "title": "...", ... }`

- `PUT /tasks/<task_id>`
  - **Description**: Updates an existing task.
  - **Body**: `{ "title": "...", "description": "...", "status": "in_progress" }` (all fields optional)
  - **Response**: `{ "id": "...", "title": "...", ... }`

- `DELETE /tasks/<task_id>`
  - **Description**: Deletes a task.
  - **Response**: `{ "message": "Task deleted" }`
