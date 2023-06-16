import ReactMarkdown from "react-markdown";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import rehypeSlug from "rehype-slug";

export const Markdown = ({ content }: { content: string }) => {
    return (
        <ReactMarkdown
            rehypePlugins={[
                [
                    rehypeExternalLinks,
                    {
                        target: "_blank",
                    },
                ],
                rehypeSlug,
                [
                    rehypeAutolinkHeadings,
                    {
                        behavior: "wrap",
                    },
                ],
            ]}
        >
            {content}
        </ReactMarkdown>
    );
};
