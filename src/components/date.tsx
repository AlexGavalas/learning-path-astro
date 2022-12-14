import { parseISO, format as formatDate } from 'date-fns';

interface FormattedDateProps {
    dateString: string;
    format?: string;
}

export default function FormattedDate({
    dateString,
    format = 'd LLL yyyy',
}: FormattedDateProps) {
    const date = parseISO(dateString);

    return <time dateTime={dateString}>{formatDate(date, format)}</time>;
}
