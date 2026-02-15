import { For, createResource } from "solid-js";
import MainLayout from "../components/MainLayout";
import Plate from "../components/Plate";

type Post = {
    title: string;
    date: string;
    content: string;
};

export default function Blogposts() {

    const [posts] = createResource<Post[]>(async () => {
        const res = await fetch(import.meta.env.VITE_API_URL + `/blogposts/`);
        if (!res.ok) {
            console.error("Failed to fetch blog posts");
            return [];
        }
        return await res.json();
    });

    return (
        <MainLayout>
            <div class="flex flex-col items-center justify-center flex-grow">
                {
                    (!posts() || posts().length === 0) ?
                    <Plate type="fight">
                        <h1 class="text-2xl font-bold mb-4">No Blog Posts Available</h1>
                    </Plate>
                :
                <>
                <For each={posts() ?? []}>
                    {(post) => {
                        const formattedPost = post.post.replaceAll("<a href=", "<a class=\"text-blue-500 hover:underline\" target=\"_blank\" href=")
                                              .replaceAll("<p>", "<p class=\"text-gray-700 mb-4\">")
                                              .replaceAll("<h2>", "<h2 class=\"text-xl font-bold mb-2\">")
                                              .replaceAll("<h1>", "<h1 class=\"text-2xl font-bold mb-4\">")
                                              .replaceAll("<h3>", "<h3 class=\"text-lg font-bold mb-2\">")
                                              .replaceAll("<img ", "<img class=\"my-4 rounded-lg\" ")
                                              .replaceAll("<ul>", "<ul class=\"list-disc list-inside mb-4\">")
                                              .replaceAll("<ol>", "<ol class=\"list-decimal list-inside mb-4 ml-4\">")
                                              .replaceAll("<li>", "<li class=\"mb-1 ml-4\">");
                        
                        const formattedDate = new Date(post.date).toLocaleDateString("hu-HU", {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                        });
                        return (
                        <Plate type="blog">
                            <a href={`/blog/${post.id}`}>
                                <h1 class="text-2xl font-bold mb-4">{post.title}</h1>
                            </a>
                            <p class="text-sm ml-auto mb-2">{formattedDate}</p>
                            {formattedPost && <div innerHTML={formattedPost} />}
                        </Plate>);
                    }}
                </For>
                </>
                }
            </div>
        </MainLayout>
    );
}