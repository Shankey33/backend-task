import axios from 'axios';
import dotenv from 'dotenv';
import { useNavigate } from 'react-router-dom';
dotenv.config();
import {useState, useEffect, createContext} from 'react';
import type { ReactNode } from 'react';

interface ContextProps {
    children: ReactNode;
}

interface User {
    id: string;
    email: string;
    name: string;
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
}

export const AppContext = createContext<AppContextInterface | null>(null);

export const AppProvider = ({children}: ContextProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const navigate = useNavigate();

    const signup = async (name: string, email: string, password: string, userType: string) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, {name, email, password, userType});
            if (response.status === 201) {
                console.log('User registered successfully');
                localStorage.setItem('token', response.data.token);
                setUser(response.data.user);
            } else {
                console.error('Failed to register user');
            }
    } catch (error) {
            console.error('Error during signup:', error);
        }
    }


    const login = async (email: string, password: string) => {
        try {
            if(localStorage.getItem('token')){
                return;
            }
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {email, password});
            if (response.status === 200) {
                console.log('User logged in successfully');
                localStorage.setItem('token', response.data.token);
                setUser(response.data.user);
            } else {
                console.error('Failed to log in user');
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            if(!token){
                navigate('/login');
                return;
            }
            const response = await axios.get(`${process.env.REACT_APP_API_URL || ''}/api/tasks`, {
                headers: { 'Authorization': `Bearer ${token}`}
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

    useEffect(() => {
        if (user) {
            fetchTasks();
        }
    }, [user]);

    return (
        <AppContext.Provider value={{user, setUser, tasks, setTasks, fetchTasks, login, signup}}>
            {children}
        </AppContext.Provider>
    );
}
