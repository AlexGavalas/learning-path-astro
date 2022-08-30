import { useEffect, useState } from 'react';

import { Button } from '../button/button';

export default function Header() {
    const [isMounted, setIsMounted] = useState(false);

    const [theme, setTheme] = useState(
        localStorage?.getItem('theme') ?? 'light'
    );

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');

        localStorage?.setItem('theme', theme);
    }, [theme]);

    const image =
        theme === 'light'
            ? {
                  src: '/moon.svg',
                  alt: 'Moon',
              }
            : {
                  src: '/sun.svg',
                  alt: 'Sun',
              };

    return (
        <header className="flex justify-between w-full items-center border-0 border-solid border-b dark:border-b-white">
            <div className="flex">
                <a
                    href="/"
                    className="cursor-pointer hover:no-underline font-[700] p-2 m-2 text-3xl text-black dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-800"
                >
                    Learning Path
                </a>
            </div>
            <div className="mr-3">
                <Button onClick={toggleTheme} variant="wrapper">
                    {isMounted && (
                        <img
                            src={image.src}
                            alt={image.alt}
                            width={20}
                            height={20}
                        />
                    )}
                </Button>
            </div>
        </header>
    );
}
