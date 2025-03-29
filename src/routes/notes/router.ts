import express from 'express';
import routeGetNote from './get';
import routeNewNote from './new';
import multer from 'multer';

const notesRouter = express.Router();

const upload = multer();

notesRouter.get('/:id', routeGetNote);
notesRouter.post('/', upload.array('files'), routeNewNote);

export default notesRouter;
