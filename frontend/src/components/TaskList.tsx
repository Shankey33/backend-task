import { useContext } from "react";
import { AppContext } from "../context/context_api";

const TaskList = () => {
    const context = useContext(AppContext);
    const tasks = context?.tasks || [];

    const handleTaskStatus = (taskId: string) => async () => {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;
      try {
        if (context?.editTask) {
          await context.editTask(taskId, task.title, task.description, !task.completed);
        } else {
          // fallback: call API directly
          const base = import.meta.env.VITE_API_URL || 'http://localhost:3000';
          await fetch(`${base}/api/tasks/${taskId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') },
            body: JSON.stringify({ completed: !task.completed })
          });
          context?.fetchTasks?.();
        }
      } catch (error) {
        console.error('Error updating task status', error);
      }
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
