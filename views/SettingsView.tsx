import React, { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { UserRole } from '../types';
import AccessDenied from '../components/AccessDenied';

const SettingsView: React.FC = () => {
    const { currentUser, users, tasks, teams, paths } = useContext(AppContext);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedCode, setGeneratedCode] = useState<string | null>(null);
    const [copySuccess, setCopySuccess] = useState(false);

    const allowedRoles = [UserRole.ADMIN, UserRole.MANAGER];
    if (!currentUser || !allowedRoles.includes(currentUser.role)) {
         return <AccessDenied />;
    }

    const generateBackendScript = () => {
        const pythonBool = (val: boolean) => (val ? 'True' : 'False');

        const users_data = `[
        ${users.map(u => `{
            'id': ${u.id},
            'username': '${u.username.replace(/'/g, "\\'")}',
            'role': '${u.role}',
            'status': '${u.status}',
            'first_login': ${pythonBool(u.first_login)},
            'created_at': '${u.created_at}',
            'last_login': ${u.last_login ? `'${u.last_login}'` : 'None'},
            'team_id': ${u.teamId ?? 'None'}
        }`).join(',\n        ')}
    ]`;
  
        const teams_data = `[
        ${teams.map(t => `{
            'id': ${t.id},
            'name': '${t.name.replace(/'/g, "\\'")}',
            'leader_id': ${t.leaderId}
        }`).join(',\n        ')}
    ]`;

        const tasks_data = `[
        ${tasks.map(t => `{
            'id': ${t.id},
            'title': '${t.title.replace(/'/g, "\\'")}',
            'description': '${t.description.replace(/'/g, "\\'").replace(/\n/g, '\\n')}',
            'status': '${t.status}',
            'assignee_id': ${t.assigneeId},
            'creator_id': ${t.creatorId},
            'created_at': '${t.createdAt}'
        }`).join(',\n        ')}
    ]`;

        const paths_data = `[
        ${paths.map(p => `{
            'id': ${p.id},
            'name': '${p.name.replace(/'/g, "\\'")}',
            'path': r'${p.path.replace(/\\/g, '\\\\')}'
        }`).join(',\n        ')}
    ]`;

        return `# app.py - Generated Runnable Backend with Data
#
# This script creates a complete Flask application with an SQLite database
# pre-populated with the data from your session.
#
# --- Instructions ---
# 1. Ensure you have Python 3 installed.
# 2. Create a virtual environment (recommended):
#    python -m venv venv
#    source venv/bin/activate  # On Windows: venv\\Scripts\\activate
# 3. Install required packages:
#    pip install Flask Flask-SQLAlchemy Werkzeug
# 4. Seed the database with your data:
#    python app.py seed
# 5. Run the Flask application:
#    python app.py
#
# The database file (app.db) will be created in the same directory.

import os
import sys
import datetime
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash

# --- App and Database Configuration ---
basedir = os.path.abspath(os.path.dirname(__file__))
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'app.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# --- Helper for parsing ISO dates with 'Z' ---
def parse_iso_datetime(date_string):
    if date_string is None:
        return None
    # Handle 'Z' for UTC timezone
    if date_string.endswith('Z'):
        date_string = date_string[:-1] + '+00:00'
    return datetime.datetime.fromisoformat(date_string)

# --- Model Definitions ---
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    role = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(50), default='active', nullable=False)
    first_login = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    last_login = db.Column(db.DateTime, nullable=True)
    team_id = db.Column(db.Integer, db.ForeignKey('team.id'), nullable=True)

class Team(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    leader_id = db.Column(db.Integer, db.ForeignKey('user.id'), unique=True)
    
    leader = db.relationship('User', foreign_keys=[leader_id], backref='led_team')
    members = db.relationship('User', foreign_keys=[User.team_id], backref='team')

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(50), default='Pending', nullable=False)
    assignee_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    
    assignee = db.relationship('User', foreign_keys=[assignee_id])
    creator = db.relationship('User', foreign_keys=[creator_id])

class Path(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    path = db.Column(db.String(255), nullable=False)

# --- Database Seeding Function ---
def seed_database():
    """Drops existing tables, creates new ones, and populates them with data."""
    with app.app_context():
        print("Dropping all tables...")
        db.drop_all()
        print("Creating all tables...")
        db.create_all()
        print("Seeding database...")

        # --- Data from your session ---
        users_data = ${users_data}
        teams_data = ${teams_data}
        tasks_data = ${tasks_data}
        paths_data = ${paths_data}

        # Seed Teams first as User has a foreign key to it
        for team_info in teams_data:
            team = Team(**team_info)
            db.session.add(team)
        db.session.commit()
        
        # Seed Users
        for user_info in users_data:
            user = User(
                id=user_info['id'],
                username=user_info['username'],
                password_hash=generate_password_hash('password123'), # Default password
                role=user_info['role'],
                status=user_info['status'],
                first_login=user_info['first_login'],
                created_at=parse_iso_datetime(user_info['created_at']),
                last_login=parse_iso_datetime(user_info['last_login']),
                team_id=user_info['team_id']
            )
            db.session.add(user)
        db.session.commit()
        
        # Seed Tasks
        for task_info in tasks_data:
            task = Task(
                id=task_info['id'],
                title=task_info['title'],
                description=task_info['description'],
                status=task_info['status'],
                assignee_id=task_info['assignee_id'],
                creator_id=task_info['creator_id'],
                created_at=parse_iso_datetime(task_info['created_at'])
            )
            db.session.add(task)

        # Seed Paths
        for path_info in paths_data:
            path = Path(**path_info)
            db.session.add(path)
            
        db.session.commit()
        print("Database seeded successfully!")

# --- Flask Routes (Placeholder) ---
@app.route('/')
def index():
    return "Backend server is running. Use 'python app.py seed' to populate the database."

# --- Main Execution ---
if __name__ == '__main__':
    # Check for 'seed' command line argument
    if len(sys.argv) > 1 and sys.argv[1] == 'seed':
        seed_database()
    else:
        # Create db if it doesn't exist, in case 'seed' was not run
        with app.app_context():
            db.create_all()
        app.run(debug=True, port=5001)
`;
    };

    const handleGenerateClick = () => {
        setIsGenerating(true);
        setGeneratedCode(null);
        setCopySuccess(false);
        setTimeout(() => {
            const backendCode = generateBackendScript();
            setGeneratedCode(backendCode.trim());
            setIsGenerating(false);
        }, 1500);
    };

    const handleCopyCode = () => {
        if (generatedCode) {
            navigator.clipboard.writeText(generatedCode);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }
    }

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Settings</h1>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">Backend Generation</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Generate a runnable Python/Flask backend script based on the current application data. This provides a complete server-side implementation with a pre-populated database.
                </p>
                <button 
                    onClick={handleGenerateClick}
                    disabled={isGenerating}
                    className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg flex items-center disabled:bg-primary-300 disabled:cursor-wait shadow-sm"
                >
                    {isGenerating ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating...
                        </>
                    ) : (
                        "Generate Backend Script"
                    )}
                </button>

                {generatedCode && (
                    <div className="mt-6 relative">
                         <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">Generated: app.py</h3>
                        <button
                            onClick={handleCopyCode}
                            className="absolute top-0 right-0 mt-2 mr-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 text-xs font-bold py-1 px-2 rounded"
                        >
                           {copySuccess ? 'Copied!' : 'Copy'}
                        </button>
                        <pre className="bg-gray-50 dark:bg-black/25 rounded-md p-4 overflow-x-auto border border-gray-200 dark:border-gray-700 max-h-[60vh]">
                            <code className="text-sm text-gray-800 dark:text-gray-200 font-mono">
                                {generatedCode}
                            </code>
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SettingsView;