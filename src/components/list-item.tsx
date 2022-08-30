import type { PropsWithChildren } from 'react';

export default function ListItem({ children }: PropsWithChildren) {
    return (
        <li className="marker:text-teal-500 dark:marker:text-yellow-500 list-disc text-[0.9em]">
            {children}
        </li>
    );
}
