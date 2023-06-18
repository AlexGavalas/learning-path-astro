// import type { CollectionEntry } from 'astro:content';

import type { Database } from '~types/database.types';

export type LessonSummary =
    Database['public']['Tables']['lesson_summaries_meta']['Row'];

// export type NotesCollection = CollectionEntry<'notes'>;

// export type NoteFrontmatter = NotesCollection['data'];
