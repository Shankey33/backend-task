import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {useState, useEffect, createContext} from 'react';
import type { ReactNode } from 'react';

interface ContextProps {
    children: ReactNode;
}

interface User {
    id: string;
    email: string;
    name: string;
    type: string;
}

interface Task{
    id: string;
    title: string;
    description: string;
    completed: boolean;
}

interface AppContextInterface {
    user: User | null;
    setUser: (user: User | null) => void;
    tasks: Task[];
    setTasks: (tasks: Task[]) => void;
    fetchTasks: () => void;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string, userType: string) => Promise<void>;
    createTask: (title: string, description: string) => Promise<void>;
    editTask: (id: string, title: string, description: string, completed: boolean) => Promise<void>;
    deleteTask?: (id: string) => Promise<void>;
    getAdminDashboard?: () => Promise<any>;
    updateAdminDashboard?: (data: any) => Promise<void>;
}

export const AppContext = createContext<AppContextInterface | null>(null);

export const AppProvider = ({children}: ContextProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const navigate = useNavigate();

    const signup = async (name: string, email: string, password: string, userType: string) => {
        try {
            const base = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const response = await axios.post(`${base}/api/register`, {name, email, password, userType});
            if (response.status === 201) {
                console.log('User registered successfully');
                localStorage.setItem('token', response.data.token);
                setUser(response.data.user);
            } else {
                const message = response.data?.message || 'Failed to register user';
                console.error(message);
                throw new Error(message);
            }
        } catch (error) {
            console.error('Error during signup:', error);
            throw error;
        }
    }


    const login = async (email: string, password: string) => {
        try {
            const base = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const response = await axios.post(`${base}/api/login`, {email, password});
            if (response.status === 200) {
                console.log('User logged in successfully');
                localStorage.setItem('token', response.data.token);
                setUser(response.data.user);
            } else {
                const message = response.data?.message || 'Failed to log in user';
                console.error(message);
                throw new Error(message);
            }
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    };

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            if(!token){
                navigate('/login');
                return;
            }
            const base = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const response = await axios.get(`${base}/api/tasks`, {
                headers: { 'Authorization': token }
            });
            if (response.status === 200) {
                setTasks(response.data.tasks);
            } else {
                console.error('Failed to fetch tasks');
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const createTask = async (title: string, description: string): Promise<void> => {
        try {
            const token = localStorage.getItem('token');
            if(!token){
                navigate('/login');
                return;
            }
            const base = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const response = await axios.post(`${base}/api/tasks`, {title, description}, {
                headers: { 'Authorization': token }
            });
            if (response.status === 201) {
                fetchTasks();
            } else {
                console.error('Failed to create task');
            }
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    const editTask = async (id: string, title: string, description: string, completed: boolean): Promise<void> => {
        try {
            const token = localStorage.getItem('token');
            if(!token){
                navigate('/login');
                return;
            }
            const base = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const response = await axios.patch(`${base}/api/tasks/${id}`, {title, description, completed}, {
                headers: { 'Authorization': token }
            });
            if (response.status === 200) {
                fetchTasks();
            } else {
                console.error('Failed to edit task');
            }
        } catch (error) {
            console.error('Error editing task:', error);
        }
    };

    const deleteTask = async (id: string): Promise<void> => {
        try {
            const token = localStorage.getItem('token');
            if(!token){
                navigate('/login');
                return;
            }
            const base = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const response = await axios.delete(`${base}/api/tasks/${id}`, {
                headers: { 'Authorization': token }
            });
            if (response.status === 200) {
                fetchTasks();
            } else {
                console.error('Failed to delete task');
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const getAdminDashboard = async () => {
        try {
            const token = localStorage.getItem('token');
            if(!token){
                navigate('/login');
                return;
            }
            const base = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const response = await axios.get(`${base}/api/admin/dashboard`, {
                headers: { 'Authorization': token }
            });
            if (response.status === 200) {
                return response.data;
            } else {
                console.error('Failed to fetch admin dashboard');
            }
        } catch (error) {
            console.error('Error fetching admin dashboard:', error);
        }
    };

    const updateAdminDashboard = async (data: any) => {
        try {
            const token = localStorage.getItem('token');
            if(!token){
                navigate('/login');
                return;
            }
            const base = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const response = await axios.patch(`${base}/api/admin/dashboard`, data, {
                headers: { 'Authorization': token }
            });
            if (response.status === 200) {
                console.log('Admin dashboard updated successfully');
            } else {
                console.error('Failed to update admin dashboard');
            }
        } catch (error) {
            console.error('Error updating admin dashboard:', error);
        }   
    };

    useEffect(() => {
        if (user) {
            fetchTasks();
        }
    }, [user]);

    return (
        <AppContext.Provider value={{user, setUser, tasks, setTasks, fetchTasks, login, signup, createTask, editTask, deleteTask, getAdminDashboard, updateAdminDashboard}}>
            {children}
        </AppContext.Provider>
    );
}
