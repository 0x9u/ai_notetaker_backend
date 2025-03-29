import dbGetNote from "@/db/notes/get";
import { Request, Response } from "express";

async function routeGetNote(req : Request, res : Response) {
    const user = req.user;

    // get note id from params
    const noteId = req.params.id;

    if (!noteId || typeof noteId !== 'string') {
        res.status(400).json({ message: 'Invalid noteId' });
        return;
    }

    const noteIdInt = parseInt(noteId);
    if (isNaN(noteIdInt)) {
        res.status(400).json({ message: 'Invalid noteId' });
        return;
    }

    const userNotes = await dbGetNote(noteIdInt, user.id);

    res.status(200).json(userNotes);
}

export default routeGetNote;
