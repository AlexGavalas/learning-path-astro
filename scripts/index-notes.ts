import 'dotenv/config';
import fs from 'fs/promises';
import matter from 'gray-matter';
import path from 'path';

import type { NoteFrontmatter } from '~types/notes.types';
import { supabase } from '~lib/supabase';
import { toISOString, getEnvVariable } from './helpers';

const NOTES_DIR = path.join(process.cwd(), 'src/content/notes');

const DELETE_LABEL = 'Delete took: ';
const INDEX_LABEL = 'Indexing took: ';

const dropNotesTable = async (): Promise<void> => {
    console.time(DELETE_LABEL);

    // Delete all records where the title is not empty, meaning all records
    const { error } = await supabase.from('notes').delete().neq('title', '');

    if (error !== null) {
        console.error('Could not delete previous notes.');
        console.error(error);

        process.exit(1);
    }

    console.timeEnd(DELETE_LABEL);
};

const updateEdgeConfig = async (): Promise<void> => {
    const { data, error } = await supabase.rpc('get_notes_meta');

    if (error !== null) {
        console.error(error);
        process.exit(1);
    }

    try {
        const edgeConfig = getEnvVariable('EDGE_CONFIG_ID');
        const vercelAccessToken = getEnvVariable('VERCEL_ACCESS_TOKEN');

        const url = `https://api.vercel.com/v1/edge-config/${edgeConfig}/items`;

        const res = await fetch(url, {
            method: 'PATCH',
            body: JSON.stringify({
                items: [
                    {
                        operation: 'update',
                        key: 'meta',
                        value: data,
                    },
                ],
            }),
            headers: {
                Authorization: `Bearer ${vercelAccessToken}`,
                'Content-Type': 'application/json',
            },
        });

        const responseData = await res.json();

        console.log('Update Edge Config response', responseData);
    } catch (e) {
        console.error(e);
    }
};

const indexDocs = async (): Promise<void> => {
    await dropNotesTable();

    const notes = await fs.readdir(NOTES_DIR);

    console.time(INDEX_LABEL);

    for (const filename of notes) {
        const fileContents = await fs.readFile(
            `${NOTES_DIR}/${filename}`,
            'utf-8',
        );

        const { content, data } = matter(fileContents) as unknown as {
            content: string;
            data: NoteFrontmatter;
        };

        if (data.published === false) {
            console.log(`Skipping ${filename} as it is not published yet ...`);

            continue;
        }

        const parsedContents = content
            .split('\n')
            .filter(Boolean)
            // Remove some markdown syntax
            .filter((line) => line !== '---' && !/^#+\s/.test(line))
            .map((line) => line.replace('-   ', ''));

        const fname = filename.replace(/\.mdx?$/, '');
        const created = toISOString(data.created);
        const updated = toISOString(data.updated);

        const values = parsedContents.map((line) => ({
            title: data.title,
            line,
            filename: fname,
            created,
            updated,
        }));

        process.stdout.write(`Writing file ${filename} in storage ...`);

        await supabase.storage
            .from('notes_md_files')
            .upload(filename, fileContents, {
                contentType: 'text/markdown',
                upsert: true,
            });

        process.stdout.write(' [OK]\n');

        process.stdout.write(`Indexing contents of ${filename} ...`);

        await supabase.from('notes').upsert(values);

        process.stdout.write(' [OK]\n');
    }

    console.log('Indexed all docs ...');

    console.timeEnd(INDEX_LABEL);

    await updateEdgeConfig();
};

indexDocs().catch((e) => {
    console.error(e);
});
