import React, { useContext, useState, useRef } from 'react';
import { AppContext } from '../contexts/AppContext';
import { SystemPath, UserRole } from '../types';
import AccessDenied from '../components/AccessDenied';

const CopyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);
const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);
const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);


const FileUploadPathItem: React.FC<{ name: string }> = ({ name }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      alert(`Uploading "${selectedFile.name}" for ${name}... (Simulation)`);
      setSelectedFile(null); 
      if(fileInputRef.current) {
          fileInputRef.current.value = ""; 
      }
    }
  };

  return (
    <li className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between">
      <div>
        <h3 className="font-semibold text-lg text-gray-800">{name}</h3>
        {selectedFile && (
           <p className="text-gray-500 font-mono text-sm mt-1 truncate max-w-xs" title={selectedFile.name}>
             Selected: {selectedFile.name}
           </p>
        )}
      </div>
      <div className="flex items-center space-x-2 mt-2 sm:mt-0">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          aria-hidden="true"
        />
        <button 
            onClick={handleBrowseClick} 
            className="text-sm font-medium text-primary-600 hover:text-primary-800 bg-primary-100 hover:bg-primary-200 px-4 py-2 rounded-md transition-colors"
        >
          Browse
        </button>
        <button 
            onClick={handleUploadClick} 
            disabled={!selectedFile} 
            className="text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 disabled:cursor-not-allowed px-4 py-2 rounded-md flex items-center transition-colors shadow-sm"
        >
          <UploadIcon className="w-4 h-4 mr-2" />
          Upload
        </button>
      </div>
    </li>
  );
};


const PathsView: React.FC = () => {
    const { paths, loading, currentUser } = useContext(AppContext);
    const [copiedPathId, setCopiedPathId] = useState<number | null>(null);
    
    const allowedRoles = [UserRole.ADMIN, UserRole.MANAGER, UserRole.TEAM_LEADER];
    if (!currentUser || !allowedRoles.includes(currentUser.role)) {
         return <AccessDenied />;
    }

    const handleCopy = (path: string, id: number) => {
        navigator.clipboard.writeText(path);
        setCopiedPathId(id);
        setTimeout(() => setCopiedPathId(null), 2000);
    };

    if (loading) return <div>Loading paths...</div>;

    const uploadablePaths = ["Windchill Data File", "PPM Files"];

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">System Paths</h1>
            
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <ul className="divide-y divide-gray-200">
                    {paths.map((p: SystemPath) => {
                        if (uploadablePaths.includes(p.name)) {
                           return <FileUploadPathItem key={p.id} name={p.name} />;
                        }
                        return (
                            <li key={p.id} className="p-4 flex items-center justify-between">
                               <div>
                                 <h3 className="font-semibold text-lg text-gray-800">{p.name}</h3>
                                 <p className="text-gray-500 font-mono text-sm">{p.path}</p>
                               </div>
                               <button 
                                 onClick={() => handleCopy(p.path, p.id)}
                                 className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                                 aria-label={`Copy path for ${p.name}`}
                                >
                                    {copiedPathId === p.id ? (
                                        <CheckIcon className="w-5 h-5 text-green-500" />
                                    ) : (
                                        <CopyIcon className="w-5 h-5 text-gray-500" />
                                    )}
                               </button>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    );
};

export default PathsView;
