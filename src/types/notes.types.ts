import type { Database } from './database.types';
import type { CollectionEntry } from 'astro:content';

export type Note = Database['public']['Tables']['notes']['Row'];

export type NotesCollection = CollectionEntry<'notes'>;
