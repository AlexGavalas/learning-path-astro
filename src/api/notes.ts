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
