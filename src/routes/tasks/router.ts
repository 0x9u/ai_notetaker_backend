import express from 'express';
import routeGetTasks from './get';

const tasksRouter = express.Router();

tasksRouter.get('/', routeGetTasks);

export default tasksRouter;
