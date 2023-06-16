import { useEffect, useState } from "react";

import { Button } from "./button";

export const Header = () => {
    const [isMounted, setIsMounted] = useState(false);

    const [theme, setTheme] = useState(
        localStorage.getItem("theme") ?? "light"
    );

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";

        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
        document.documentElement.style.setProperty("color-scheme", newTheme);
    };

    const image =
        theme === "light"
            ? {
                  src: "/moon.svg",
                  alt: "Moon",
              }
            : {
                  src: "/sun.svg",
                  alt: "Sun",
              };

    return (
        <header className="flex w-full items-center justify-between border-0 border-b border-solid dark:border-b-white">
            <div className="flex">
                <a
                    href="/"
                    className="my-2 cursor-pointer rounded-lg p-2 text-3xl font-[700] text-black hover:bg-gray-300 hover:no-underline dark:text-white dark:hover:bg-gray-800"
                >
                    Learning Path
                </a>
            </div>
            <div className="mr-3">
                {isMounted && (
                    <Button onClick={toggleTheme} variant="wrapper">
                        <img
                            src={image.src}
                            alt={image.alt}
                            width={20}
                            height={20}
                        />
                    </Button>
                )}
            </div>
        </header>
    );
};
