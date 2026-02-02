interface BlogPostBarProps {
    id: number;
    title: string;
    date: string;
}

export default function BlogManager(props: BlogPostBarProps) {
    return (
        <div class="flex flex-col border-b border-gray-300 p-4">
            <h2>{props.title}</h2>
            <p>{props.date}</p>
        </div>
    );
}