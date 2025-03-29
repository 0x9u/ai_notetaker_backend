import tasks from "@/helpers/tasks";
import { Request, Response } from "express";

async function routeGetTasks(req : Request, res : Response) {
    const user = req.user;

    const userTasks = tasks[user.id] ?? {};

    res.status(200).json(userTasks);
}

export default routeGetTasks;
