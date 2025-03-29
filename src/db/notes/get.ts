import Summary from '@/types/summary';
import { supabase } from '../supabase';
import Transcript from '@/types/transcript';

async function dbGetNote(noteId: number, userId: string) {
    const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('id', noteId)
        .eq('user_id', userId)
        .single();

    if (error) {
        throw error;
    }

    const { data: fileData, error: filesError } = await supabase
        .from('files')
        .select('id')
        .eq('note_id', noteId);

    if (filesError) {
        throw filesError;
    }

    const fileIds = fileData.map((file) => file.id as number);

    const summaries: Record<number, Summary[]> = {};
    const transcripts: Record<number, Transcript[]> = {};

    for (const fileId of fileIds) {
        const { data: summariesData, error: summariesError } = await supabase
            .from('summaries')
            .select('*')
            .eq('file_id', fileId);

        if (summariesError) {
            throw summariesError;
        }

        const { data: transcriptsData, error: transcriptsError } =
            await supabase
                .from('transcripts')
                .select('*')
                .eq('file_id', fileId);

        if (transcriptsError) {
            throw transcriptsError;
        }

        summaries[fileId as number] = summariesData.map((summary) => ({
            id: summary.id as number,
            fileId: summary.file_id as number,
            start: summary.start as number,
            end: summary.end as number,
            title: summary.title as string,
            content: summary.content as string,
        }));

        transcripts[fileId as number] = transcriptsData.map((transcript) => ({
            id: transcript.id as number,
            fileId: transcript.file_id as number,
            start: transcript.start as number,
            end: transcript.end as number,
            content: transcript.content as string,
        }));
    }

    return {
        id: data.id as number,
        title: data.title as string,
        content: data.content as string,
        userId: data.user_id as string,
        fileIds,
        summaries,
        transcripts,
    };
}

export default dbGetNote;
