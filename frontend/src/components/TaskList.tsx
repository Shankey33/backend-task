import { useContext } from "react";
import { AppContext } from "../context/context_api";
import axios from "axios";

const TaskList = () => {
    const context = useContext(AppContext);
    const tasks = context?.tasks || [];

    const handleTaskStatus = (taskId: string) => () => {

        axios.put(`/api/tasks/${taskId}`, { completed: !tasks.find(task => task.id === taskId)?.completed })
            .then(response => {
                console.log('Task status updated', response.data);
                // refresh tasks 
                context?.fetchTasks();
            })
            .catch(error => {
                console.error('Error updating task status', error);
            });
    };

  return (
    <div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <h4>{task.title}</h4>
            <p>{task.description}</p>
            <p>Status: {task.completed ? 'Completed' : 'Pending'}</p>
            <button onClick={handleTaskStatus(task.id)}>Toggle Status</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TaskList
