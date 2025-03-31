import { addTask, deleteTask } from "@/helpers/tasks";
import createNote from "@/notes/new";
import { Request, Response } from "express";

async function routeNewNote(req : Request, res : Response) {
    const user = req.user;
    const userId = "fake" //user.id;

    let { ytUrl, categoryId } = req.body;
    if (ytUrl && (typeof ytUrl !== 'string')) {
        res.status(400).json({ message: 'Invalid ytUrl' });
        return;
    }

    if (categoryId && (typeof categoryId !== 'number')) {
        res.status(400).json({ message: 'Invalid categoryId' });
        return;
    }

    if (!ytUrl) {
        ytUrl = null;
    }

    if (!categoryId) {
        categoryId = null;
    }
    
    const files = req.files as Express.Multer.File[];
    const task = addTask(userId, 'Note creation');

    createNote(task, files, ytUrl, categoryId).catch((error) => {
        console.error(error);
        deleteTask(userId, task.taskId);
    })
    
    res.status(200).json({
        message: 'Note creation started',
    });
}

export default routeNewNote;
