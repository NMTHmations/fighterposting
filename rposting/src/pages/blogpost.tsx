import { createResource, Show } from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";
import MainLayout from "../components/MainLayout";
import Plate from "../components/Plate";

export default function Blogpost() {

    type BlogpostData = {
        id: number;
        title: string;
        date: string;
        post: string;
    };

    const params = useParams();

    const [data] = createResource<BlogpostData>(async () => {
        const response = await fetch(import.meta.env.VITE_API_URL + "/blogposts/" + params.slug );
        if (!response.ok) throw new Error("Failed to fetch");
        return response.json();
    });

    return (
        <MainLayout>
            <div class="flex flex-col items-center justify-center flex-grow">
                <Plate type="blog">
                    <Show when={data()} fallback={<p>Loading...</p>}>
                        {(blog) => {
                            const formattedDate = new Date(blog().date).toLocaleDateString("hu-HU", {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                            });

                            console.log(blog().date);

                            const formattedPost = blog().post
                                .replaceAll("<a href=", "<a class=\"text-blue-500 hover:underline\" target=\"_blank\" href=")
                                .replaceAll("<p>", "<p class=\"text-gray-700 mb-4\">")
                                .replaceAll("<h2>", "<h2 class=\"text-xl font-bold mb-2\">")
                                .replaceAll("<h1>", "<h1 class=\"text-2xl font-bold mb-4\">")
                                .replaceAll("<h3>", "<h3 class=\"text-lg font-bold mb-2\">")
                                .replaceAll("<img ", "<img class=\"my-4 rounded-lg\" ")
                                .replaceAll("<ul>", "<ul class=\"list-disc list-inside mb-4\">")
                                .replaceAll("<ol>", "<ol class=\"list-decimal list-inside mb-4 ml-4\">")
                                .replaceAll("<li>", "<li class=\"mb-1 ml-4\">");

                            return (
                                <>
                                    <h1 class="text-2xl font-bold mb-4">
                                        {blog().title}
                                    </h1>

                                    <p class="text-sm ml-auto mb-2">
                                        {formattedDate}
                                    </p>

                                    <div innerHTML={formattedPost} />
                                </>
                            );
                        }}
                    </Show>
                </Plate>
            </div>
        </MainLayout>
    );
}