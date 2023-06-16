import {
    type FormEventHandler,
    type MouseEventHandler,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import { Button } from "./button";
import { Input } from "./input";

import { useKeypress } from "../hooks/use-keypress";

const QUERY_FIELD_NAME = "q";

const Loader = () => (
    <div className="absolute bottom-[-8px] h-[2px] w-full animate-loader bg-gradient-to-r from-white from-0% via-light-primary via-50% to-white to-100% bg-[length:25%_100%] bg-center bg-no-repeat dark:via-dark-primary" />
);

export const SearchArea = ({ q }: { q: string }) => {
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

    useKeypress("/", keyPressHandler);

    const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        setLoading(true);

        const url = new URL(location.href);

        if (query) {
            url.searchParams.set(QUERY_FIELD_NAME, query);
        } else {
            url.searchParams.delete(QUERY_FIELD_NAME);
        }

        window.location.href = url.toString();
    };

    const onClear: MouseEventHandler<HTMLButtonElement> = async () => {
        setQuery("");

        queryEl.current?.focus();

        const url = new URL(location.href);

        url.searchParams.delete(QUERY_FIELD_NAME);

        window.location.href = url.toString();
    };

    return (
        <form onSubmit={onSubmit} className="relative flex h-16 items-center">
            <Input
                label="Search notes"
                name={QUERY_FIELD_NAME}
                ref={queryEl}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
                placeholder="Type here"
            />
            <div className="absolute bottom-0 right-0 flex h-1/2 gap-2 p-1">
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
};
