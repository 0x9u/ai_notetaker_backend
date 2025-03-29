import { generateCategoryTitle } from "@/ai/generateCategoryTitle";
import { generateNote, noteGenerateSchema } from "@/ai/generateNote";
import { generateSummary } from "@/ai/generateSummary";
import { generateTranscript } from "@/ai/generateTranscript";
import dbCreateCategory from "@/db/category/new";
import dbUploadFile from "@/db/files/new";
import dbCreateNote from "@/db/notes/new";
import dbCreateSummary from "@/db/summaries/new";
import dbCreateTranscript from "@/db/transcripts/new";
import { uploadFile } from "@/helpers/gemini";
import tasks, { deleteTask } from "@/helpers/tasks";
import Summary from "@/types/summary";
import Task from "@/types/task";
import Transcript from "@/types/transcript";

/*
todo:
- Multiple files can be added to one note
- Url can be used
- title is auto generated
*/

// todo pass in a task object and update it in the createNote 

async function createNote(task: Task, files: Express.Multer.File[], ytUrl: string | null, categoryId: number | null) {
    // todo: move this to its own function
    const transcriptSummaryData : Record<string, {
        transcripts: Transcript[],
        summaries: Summary[]
    }> = {};

    task.status = 'Transcribing and summarizing files';

    await Promise.all(files.map(async (file, index) => {
        const fileType = file.mimetype.split('/')[0];
        if (fileType !== 'audio' && fileType !== 'video') {
            return;
        }
        const transcripts = await generateTranscript(file, fileType);
        const summaries = await generateSummary(transcripts);
        transcriptSummaryData[index + '-' + file.originalname] = {
            transcripts,
            summaries,
        };
    }));


    if (ytUrl) {
        task.status = 'Transcribing and summarizing ' + ytUrl;
        // todo: implement yt fetch transcript
    }

    task.percentage = 50;

    task.status = 'Preparing to generate note';

    // upload all files to gemini database

    const uris = await Promise.all(files.map(async (file) => {
        return {
            data: await uploadFile(file),
            mimeType: file.mimetype,
        };
    }));

    // Create a big huge summary

    const input : noteGenerateSchema[] = uris.map((uri) => {
        return {
            ...uri,
            type: 'file',
        }
    });

    const note = await generateNote(input);

    const userId = task.userId;

    if (!categoryId) {
        task.status = 'Creating category title';
        task.percentage = 85;
        
        const categoryTitle = await generateCategoryTitle(note.content);
        categoryId = await dbCreateCategory(categoryTitle, userId);
    }

    const noteId = await dbCreateNote(note.title, note.content, userId);

    // now time to upload them files

    task.status = "Uploading files to database";

    await Promise.all(files.map(async (file, index) => {
        const fileId = await dbUploadFile(file, noteId);
        const hashName = index + '-' + file.originalname;
        const data = transcriptSummaryData[hashName];
        if (!data) {
            return;
        }
        for (const transcript of data.transcripts) {
            dbCreateTranscript(transcript.content, transcript.start, transcript.end, fileId);
        }
        for (const summary of data.summaries) {
            dbCreateSummary(summary.content, summary.title, summary.start, summary.end, fileId);
        }
    }));

    // save the summary and transcript to the database
    task.percentage = 100;
    task.status = 'Note created';

    // delete task after 10 seconds
    deleteTask(userId, task.taskId);
}

export default createNote;
