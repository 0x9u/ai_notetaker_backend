import AssemblyAI from '@/helpers/assemblyAI';
import { extractAudio } from '@/helpers/ffmpeg';
import Transcript from '@/types/transcript';

export async function generateTranscript(file: Express.Multer.File, type: 'audio' | 'video') : Promise<Transcript[]> {
    let audioFile = type === 'audio' ? file : await extractAudio(file);

    let transcript = await AssemblyAI.transcripts.transcribe({
        audio: audioFile.buffer,
    });

    if (transcript.status === 'error') {
        throw new Error(transcript.error);
    }

    if (transcript.chapters === null ||
        transcript.chapters === undefined) {
        throw new Error('No chapters found');
    }

    console.debug("transcript Response: ", transcript);

    return transcript.chapters.map((chapter) => {
        return {
            start: chapter.start,
            end: chapter.end,
            content: chapter.summary,
        };
    });
}
