# iTask Full-Stack Application

This is a full-stack task management application with a React frontend and a Flask/PostgreSQL backend.

## Backend Setup (Flask & PostgreSQL)

### 1. Prerequisites
- Python 3.8+ and `pip`
- PostgreSQL server installed and running

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
    *   Create a `.env` file in the `backend` directory by copying the example:
        ```bash
        cp .env.example .env
        ```
    *   Open the `.env` file and edit the variables:
        *   `DATABASE_URL`: Set this to your PostgreSQL connection string.
            *   *Example:* `postgresql://your_db_user:your_db_password@localhost:5432/itask_db`
            *   You may need to create the `itask_db` database in PostgreSQL first.
        *   `JWT_SECRET_KEY`: Change this to a long, random, and secret string.

5.  **Initialize and Run Database Migrations:**
    *   Initialize the Alembic migration environment (only needs to be run once per project):
        ```bash
        flask db init
        ```
    *   Create the initial migration script. This will detect the User and Task models, including the unique constraint on the username:
        ```bash
        flask db migrate -m "Initial migration"
        ```
    *   Apply the migrations to create the tables in your database:
        ```bash
        flask db upgrade
        ```

6.  **Seed the Database (Optional):**
    *   To create a default admin user with credentials `admin` / `admin`, run the seed command:
        ```bash
        flask seed
        ```

7.  **Run the Flask Backend Server:**
    ```bash
    flask run --port=5001
    ```
    The backend API will now be running at `http://127.0.0.1:5001`.

## Frontend Setup (React)

The frontend is designed to run in the browser-based development environment where this project was created.

1.  **API Configuration:**
    *   The frontend is pre-configured to connect to the backend API at `http://127.0.0.1:5001`.
    *   Ensure your Flask backend is running on port 5001 as instructed above.

2.  **Running the App:**
    *   With the backend running, the frontend should work out-of-the-box.
    *   You can now register a new user, log in, and start managing your tasks.
