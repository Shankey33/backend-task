import { Router } from 'express';
import {getAdminDashboard, updateAdminDashboard} from '../controller/adminController.js';
const adminRouter = Router();

adminRouter.get('/dashboard', getAdminDashboard);
adminRouter.patch('/dashboard', updateAdminDashboard);

export default adminRouter;