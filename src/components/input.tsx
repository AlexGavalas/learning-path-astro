import { type ForwardedRef, type InputHTMLAttributes, forwardRef } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
};

const InputComponent = (
    { label, ...props }: InputProps,
    ref: ForwardedRef<HTMLInputElement>,
): JSX.Element => (
    <label className="flex h-full w-full flex-col">
        <span>{label}</span>
        <input
            {...props}
            ref={ref}
            className="h-1/2 w-full text-sm rounded border-[1px] border-solid bg-transparent pl-2 dark:border-0 dark:bg-neutral-800 dark:placeholder-gray-300 dark:placeholder-opacity-50"
        />
    </label>
);

export const Input = forwardRef(InputComponent);
