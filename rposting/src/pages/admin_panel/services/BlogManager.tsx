import { For, createEffect, createResource, createSignal } from "solid-js";
import BlogPostBar from "../../../components/BlogPostBar";
import ModalWindow from "../../../components/ModalWindow";
import { Plus } from "lucide-solid";
import Quill from "quill";

export default function BlogManager() {

    const [editMode, setEditMode] = createSignal(false);

    const [blogposts] = createResource(async () => {
        const response = await fetch(import.meta.env.VITE_API_URL + `/blogposts/`);
        if (!response.ok) throw new Error("Failed to fetch");
        return await response.json();
    });

    // <textarea id="content" class="w-full p-2 border border-gray-300 rounded mb-4 h-40"></textarea>

    createEffect(() => {
        if (!editMode()) return;
        const quill = new Quill('#editor', 
                    { modules: { toolbar: true }, 
                      theme: 'snow'
                    });
    })

    return (
        <div>
            <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 mb-4" onclick={() => {setEditMode(true)}}><Plus class="w-4 h-4 mr-1 mb-1 inline-block"/> Új blog poszt létrehozása</button>
            {
                blogposts.length > 0 && blogposts ?
            <For each={blogposts()}>
                {(blogpost) => (
                    <BlogPostBar
                        id={blogpost.id}
                        title={blogpost.title}
                        date={blogpost.date}
                        ></BlogPostBar>
                    )
                }
            </For>
            :
            <div class="flex flex-col items-center justify-center flex-grow h-32">
            <p class="text-center">No blog posts available</p>
            </div>
            }
            { editMode() ?
            <ModalWindow setOpenAddWindow={setEditMode}>
                <h1 class="text-xl font-bold mb-4">Új blog poszt létrehozása</h1>
                <label for="title" class="block mb-2 font-semibold">Cím:</label>
                <input type="text" id="title" class="w-full p-2 border border-gray-300 rounded mb-4" />
                <label for="content" class="block mb-2 font-semibold">Tartalom:</label>
                <div id="editor" class="h-[400px] mb-4"></div>
                <button class="bg-blue-600 text-white px-4 py-2 mt-4 rounded hover:bg-blue-800" onclick={async () => {
                    // Add blog post logic here
                }}>Hozzáadás</button>
            </ModalWindow>
            : null }
        </div>
    );
}