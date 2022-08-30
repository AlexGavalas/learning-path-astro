import type { FormEventHandler, MouseEventHandler } from 'react';
import { useEffect, useState, useRef } from 'react';

// import type { Post } from '@lib/posts';
type Post = any;

import { Button } from './button/button';
import Input from './input';
import Loader from './loader';

const QUERY_FIELD_NAME = 'query';

// interface Note {
//     title: string;
//     line: string;
// }

export default function SearchArea({
    query: initialQueryValue,
}: {
    query: string;
}) {
    const queryEl = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState(initialQueryValue);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === '/') {
                e.preventDefault();
                queryEl.current?.setSelectionRange(query.length, query.length);
                queryEl.current?.focus();
            }
        };

        document.addEventListener('keyup', handler);

        return () => {
            document.removeEventListener('keyup', handler);
        };
    }, []);

    const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        location.search = new URLSearchParams({ query }).toString();

        return;

        if (!query) {
            return; // setPosts(posts);
        }

        setLoading(true);

        try {
            // const { data } = await supabase.rpc<Note>('search_notes', {
            //     q: query,
            // });
            // const lines =
            //     data?.reduce<Record<string, string[]>>(
            //         (acc, { title, line }) => {
            //             acc[title] = (acc[title] || []).concat(line);
            //             return acc;
            //         },
            //         {}
            //     ) ?? {};
            // const postTitles = data?.map(({ title }) => title) ?? [];
            // const filteredPosts = posts.filter(({ title }) =>
            //     postTitles.includes(title)
            // );
            // setPosts(filteredPosts);
            // setLines(lines);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const onClear: MouseEventHandler<HTMLButtonElement> = () => {
        setQuery('');
        // setPosts(posts);
        // setLines({});
    };

    return (
        <form
            onSubmit={onSubmit}
            className="relative h-8 flex items-center text-base"
        >
            <Input
                name={QUERY_FIELD_NAME}
                ref={queryEl}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
                placeholder="Search notes"
            />
            <div className="h-full p-1 absolute right-0 flex gap-2">
                {query && (
                    <Button onClick={onClear} type="button">
                        Clear
                    </Button>
                )}
                <Button>Search</Button>
            </div>
            {loading && <Loader />}
        </form>
    );
}
