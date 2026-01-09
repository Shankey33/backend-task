import { Router } from "express";
import { registerUserController, fetchUserController, fetchTasksController, createTaskController, updateTaskController, deleteTaskController} from "../controller/regularUserController.js";
import { authenticate } from "../middleware/Auth.js";

const regularRouter = Router();

// Sign Up / Login routes
regularRouter.post('/register', registerUserController);
regularRouter.post('/login', fetchUserController);
// Tasks CRUD routes (require authentication)
regularRouter.get('/tasks', authenticate, fetchTasksController);
regularRouter.post('/tasks', authenticate, createTaskController);
regularRouter.patch('/tasks/:id', authenticate, updateTaskController);
regularRouter.delete('/tasks/:id', authenticate, deleteTaskController);

export default regularRouter;