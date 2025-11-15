import { USERS, TEAMS, TASKS, PATHS } from '../constants';
import { User, Team, Task, SystemPath } from '../types';

// Simulate a network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// "Database"
let users: User[] = JSON.parse(JSON.stringify(USERS));
let teams: Team[] = JSON.parse(JSON.stringify(TEAMS));
let tasks: Task[] = JSON.parse(JSON.stringify(TASKS));
let paths: SystemPath[] = JSON.parse(JSON.stringify(PATHS));

export const api = {
    getUsers: async (): Promise<User[]> => {
        await delay(200);
        return users;
    },

    updateUser: async (updatedUser: User): Promise<User> => {
        await delay(300);
        users = users.map(user => (user.id === updatedUser.id ? updatedUser : user));
        return updatedUser;
    },
    
    createUser: async (newUser: Omit<User, 'id' | 'created_at'>): Promise<User> => {
        await delay(300);
        const user: User = {
            ...newUser,
            id: Math.max(0, ...users.map(u => u.id)) + 1,
            created_at: new Date().toISOString(),
        };
        users.push(user);
        return user;
    },

    deleteUser: async (userId: number): Promise<{ id: number }> => {
        await delay(300);
        users = users.filter(user => user.id !== userId);
        return { id: userId };
    },

    getTasks: async (): Promise<Task[]> => {
        await delay(200);
        return tasks;
    },

    createTask: async (newTask: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
        await delay(300);
        const task: Task = {
            ...newTask,
            id: Math.max(0, ...tasks.map(t => t.id)) + 1,
            createdAt: new Date().toISOString(),
        };
        tasks.push(task);
        return task;
    },

    updateTask: async (taskId: number, updates: Partial<Omit<Task, 'id'>>): Promise<Task> => {
        await delay(300);
        let updatedTask: Task | undefined;
        tasks = tasks.map(task => {
            if (task.id === taskId) {
                updatedTask = { ...task, ...updates };
                return updatedTask;
            }
            return task;
        });
        if (!updatedTask) {
            throw new Error('Task not found');
        }
        return updatedTask;
    },
    
    deleteTask: async (taskId: number): Promise<{ id: number }> => {
        await delay(300);
        tasks = tasks.filter(task => task.id !== taskId);
        return { id: taskId };
    },

    getTeams: async (): Promise<Team[]> => {
        await delay(200);
        return teams;
    },
    
    getPaths: async (): Promise<SystemPath[]> => {
        await delay(200);
        return paths;
    },

    savePath: async (path: Omit<SystemPath, 'id'>): Promise<SystemPath> => {
        await delay(300);
        const newPath: SystemPath = {
            ...path,
            id: Math.max(...paths.map(p => p.id)) + 1,
        };
        paths.push(newPath);
        return newPath;
    }
};