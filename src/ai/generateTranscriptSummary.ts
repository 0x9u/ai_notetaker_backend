import AssemblyAI from '@/helpers/assemblyAI';
import { extractAudio } from '@/helpers/ffmpeg';
import Summary from '@/types/summary';
import Transcript from '@/types/transcript';

export async function generateTranscriptSummary(
    file: Express.Multer.File,
    type: 'audio' | 'video'
) {
    let audioFile = type === 'audio' ? file : await extractAudio(file);

    let transcript = await AssemblyAI.transcripts.transcribe({
        audio: audioFile.buffer,
        auto_chapters: true,
    });

    if (transcript.status === 'error') {
        throw new Error(transcript.error);
    }

    if (!transcript.chapters) {
        throw new Error('No chapters found in transcript');
    }

    const { paragraphs } = await AssemblyAI.transcripts.paragraphs(
        transcript.id
    );

    console.log("Finished generating transcript summary");

    return {
        summaries: transcript.chapters.map((chapter) => {
            return {
                start: chapter.start,
                end: chapter.end,
                content: chapter.summary,
                title: chapter.headline,
            };
        }) as Summary[],
        transcripts: paragraphs.map((paragraph) => {
            return {
                start: paragraph.start,
                end: paragraph.end,
                content: paragraph.text,
            };
        }),
    };
}
