import { useContext } from 'react';
import { AppContext } from '../context/context_api';
import TaskList from '../components/TaskList';
import Auth from '../components/Auth';


function LandingPage() {
    
    const context = useContext(AppContext);
    const user = context?.user;
    
    return (
        <div>
            <h4>Welcome, {user?.name} to your tasks dashboard</h4>
            {user ? ( 
                <TaskList />
            ) : (
                <>
                <h2>Please Log in to see your tasks.</h2>
                <Auth />
                </>
            )}
        </div>

    );
    
}

export default LandingPage;