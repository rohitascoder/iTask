import React from 'react';

const LockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

const AccessDenied: React.FC = () => (
    <div className="flex items-center justify-center h-full p-4">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-8 text-center max-w-md mx-auto">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <LockIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-800">Access Denied</h2>
            <p className="mt-2 text-gray-600">You do not have the required permissions to view this page.</p>
        </div>
    </div>
);

export default AccessDenied;
