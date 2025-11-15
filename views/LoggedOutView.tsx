import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

const LoggedOutView: React.FC = () => {
    const { login } = useContext(AppContext);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-w-sm w-full">
                 <div className="flex items-center justify-center mb-4">
                    <svg className="h-10 w-10 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="ml-2 text-2xl font-semibold">Gemini Tasks</span>
                </div>
                <h1 className="text-2xl font-bold mb-2">You have been logged out.</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Thank you for using the application.</p>
                <button
                    onClick={() => login()}
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
                >
                    Log In
                </button>
            </div>
        </div>
    );
};

export default LoggedOutView;
