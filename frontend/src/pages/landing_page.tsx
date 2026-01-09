import { useContext } from 'react';
import { AppContext } from '../context/context_api';
import TaskList from '../components/TaskList';
import Auth from '../components/Auth';
import AdminPanel from '../components/adminPannel';


function LandingPage() {
    
    const context = useContext(AppContext);
    const user = context?.user;
    
    return (
        <div>
            {user ? (
                user.type === 'admin' ? (
                    <AdminPanel />
                ) : (
                    <TaskList />
                )
            ) : (
                <>
                    <Auth />
                </>
            )}
        </div>

    );
    
}

export default LandingPage;