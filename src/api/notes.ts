import { createClient } from "@vercel/edge-config";

import { supabase } from "../lib/supabase";
import type { Note } from "../types/notes.types";

type Lines = Record<string, string[]>;

const edgeConfig = createClient(import.meta.env.PUBLIC_EDGE_CONFIG);

export const fetchNotes = async (q: string) => {
    const data = await edgeConfig.get<Note[]>("meta");

    const allNotes = data ?? [];

    if (q) {
        const { data, error } = await supabase.rpc("search_notes", { q });

        if (error) {
            return {
                notes: [],
                lines: {},
                error: true,
            };
        }

        const lines = data.reduce<Lines>((acc, { title, line }) => {
            acc[title] = (acc[title] || []).concat(line);
            return acc;
        }, {});

        const noteTitles = new Set(data.map(({ title }) => title));

        const filteredNotes = allNotes.filter(({ title }) =>
            noteTitles.has(title)
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

export const getAllNoteIds = async () => {
    const { data: fileNames, error } = await supabase.storage
        .from("notes_md_files")
        .list();

    if (error) {
        console.error(error);

        return null;
    }

    return fileNames.map((file) => ({
        id: file.name.replace(/\.mdx$/, ""),
    }));
};

export const getNoteData = async (filename: string) => {
    const filePath = `${filename}.mdx`;

    const { data: fileContents, error } = await supabase.storage
        .from("notes_md_files")
        .download(filePath);

    if (error) {
        console.error(error);

        return null;
    }

    return await fileContents.text();
};

export const getNoteMetadata = async (filename: string) => {
    const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("filename", filename)
        .limit(1)
        .single();

    if (error) {
        console.error(error);

        return null;
    }

    return data;
};
