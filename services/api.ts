import { Task, TaskStatus } from '../types';

const API_BASE_URL = 'http://127.0.0.1:5001/api';

// Helper to get JWT token from localStorage
const getToken = (): string | null => {
    return localStorage.getItem('jwt_token');
};

// Helper to perform API requests
const apiRequest = async <T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    body?: any
): Promise<T> => {
    const token = getToken();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    // Handle responses with no content
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return response.json() as Promise<T>;
    }

    return null as T;
};

// --- Auth ---
export const login = (data: any) => apiRequest<{ access_token: string }>('/auth/login', 'POST', data);
export const register = (data: any) => apiRequest('/auth/register', 'POST', data);

// --- Tasks ---
export const getTasks = () => apiRequest<Task[]>('/tasks', 'GET');
export const createTask = (data: { title: string; description: string; }) => 
    apiRequest<Task>('/tasks', 'POST', data);
export const updateTask = (taskId: string, data: { title?: string; description?: string; status?: TaskStatus; }) =>
    apiRequest<Task>(`/tasks/${taskId}`, 'PUT', data);
export const deleteTask = (taskId: string) => apiRequest<{message: string}>(`/tasks/${taskId}`, 'DELETE');
