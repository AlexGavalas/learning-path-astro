import {
    type FormEventHandler,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

import Loader from './loader.astro';
import { Button } from './button';
import { Input } from './input';
import { useKeypress } from '../hooks/use-keypress';
import { QUERY_FIELD_NAME } from '../constants';

export const SearchArea = ({ q }: { q: string }): JSX.Element => {
    const queryEl = useRef<HTMLInputElement>(null);

    const [query, setQuery] = useState(q);

    const [loading, setLoading] = useState(false);

    const keyPressHandler = useCallback((e: KeyboardEvent) => {
        e.stopImmediatePropagation();
        queryEl.current?.focus();
    }, []);

    useEffect(() => {
        setLoading(false);
    }, []);

    useKeypress('/', keyPressHandler);

    const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        setLoading(true);

        const url = new URL(location.href);

        if (query.length > 0) {
            url.searchParams.set(QUERY_FIELD_NAME, query);
        } else {
            url.searchParams.delete(QUERY_FIELD_NAME);
        }

        window.location.href = url.toString();
    };

    return (
        <form onSubmit={onSubmit} className="relative flex h-16 items-center">
            <Input
                label="Search notes"
                name={QUERY_FIELD_NAME}
                ref={queryEl}
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                }}
                autoComplete="off"
                placeholder="Type here"
                type="search"
            />
            <div className="absolute bottom-0 right-0 flex h-1/2 gap-2 p-1 text-sm">
                <Button>Search</Button>
            </div>
            {loading && <Loader />}
        </form>
    );
};
