import { createClient } from '@vercel/edge-config';
import {
    getEntryBySlug,
    getCollection,
    type CollectionEntry,
} from 'astro:content';

import { supabase } from '~lib/supabase';
import type { Note, NotesCollection } from '~types/notes.types';

type Lines = Record<string, string[]>;

const edgeConfig = createClient(import.meta.env.PUBLIC_EDGE_CONFIG);

export const fetchNotes = async (
    q: string,
): Promise<{ lines: Lines; notes: Note[] }> => {
    const data = await edgeConfig.get<Note[]>('meta');

    const allNotes = data ?? [];

    if (q.length > 0) {
        const { data, error } = await supabase.rpc('search_notes', { q });

        if (error !== null) {
            return {
                notes: [],
                lines: {},
            };
        }

        const lines = data.reduce<Lines>((acc, { title, line }) => {
            acc[title] = (acc[title] ?? []).concat(line);
            return acc;
        }, {});

        const noteTitles = new Set(data.map(({ title }) => title));

        const filteredNotes = allNotes.filter(({ title }) =>
            noteTitles.has(title),
        );

        return {
            notes: filteredNotes,
            lines,
        };
    }

    return {
        notes: allNotes,
        lines: {},
    };
};

// Gets all note slugs

type NoteSlugs = { slug: string }[];

const getSlugsFromStorage = async (): Promise<NoteSlugs | null> => {
    const { data: fileNames, error } = await supabase.storage
        .from('notes_md_files')
        .list();

    if (error !== null) {
        console.error(error);

        return null;
    }

    return fileNames.map((file) => ({
        slug: file.name.replace(/\.mdx?$/, ''),
    }));
};

export const getAllNoteIds = async (): Promise<{ slug: string }[] | null> => {
    const isProd = import.meta.env.PROD;

    if (isProd) {
        return await getSlugsFromStorage();
    }

    return await getCollection('notes');
};

// Gets note data

type AstroRenderResult = Awaited<
    ReturnType<CollectionEntry<'notes'>['render']>
>;

const getNoteDataFromStorage = async (
    filePath: string,
): Promise<string | null> => {
    const { data: fileContents, error } = await supabase.storage
        .from('notes_md_files')
        .download(filePath);

    if (error !== null) {
        console.error(error);

        return null;
    }

    return await fileContents.text();
};

export const getNoteData = async (
    filename: string,
): Promise<AstroRenderResult | string | null> => {
    const isProd = import.meta.env.PROD;

    if (isProd) {
        const filePath = `${filename}.mdx`;

        return await getNoteDataFromStorage(filePath);
    }

    const note = await getEntryBySlug('notes', filename);

    return (await note?.render()) ?? '';
};

// Gets note metadata

export const getNoteMetadata = async (
    filename: string,
): Promise<NotesCollection['data'] | null> => {
    const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('filename', filename)
        .limit(1)
        .maybeSingle();

    if (error !== null) {
        console.error(error);

        return null;
    }

    return data;
};
