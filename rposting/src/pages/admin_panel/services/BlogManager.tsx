import { For, createEffect, createResource, createSignal } from "solid-js";
import BlogPostBar from "../../../components/BlogPostBar";
import ModalWindow from "../../../components/ModalWindow";
import { Plus } from "lucide-solid";
import Quill from "quill";

export default function BlogManager() {

    const [editMode, setEditMode] = createSignal(false);

    const [blogposts, { refetch }] = createResource(async () => {
        const response = await fetch(import.meta.env.VITE_API_URL + `/blogposts/`);
        if (!response.ok) throw new Error("Failed to fetch");
        return await response.json();
    });

    let quill: Quill;

    // <textarea id="content" class="w-full p-2 border border-gray-300 rounded mb-4 h-40"></textarea>

    createEffect(() => {
        if (!editMode()) return;
        quill = new Quill('#editor', 
                    { modules: { toolbar: true }, 
                      theme: 'snow'
                    });
    })

    const addBlogPost = async () => {
        const formData = new FormData();
        let title = (document.getElementById("title") as HTMLInputElement).value;
        if (!title || title.trim() === "") {
            alert("A cím mező nem lehet üres.");
            return;
        }
        formData.append("title", title);
        formData.append("post", quill.root.innerHTML);
        const response = await fetch(import.meta.env.VITE_API_URL +`blogposts/add/`, {
            method: "POST",
            credentials: "include",
            body: formData
        });
        if (response.ok) {
            alert("Blog post added successfully");
            setEditMode(false);
            refetch();
        }
        else {
            alert("Failed to add blog post");
            response.text().then(text => console.log(text));
        }
    };

    return (
        <div>
            <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 mb-4" onclick={() => {setEditMode(true)}}><Plus class="w-4 h-4 mr-1 mb-1 inline-block"/> Új blog poszt létrehozása</button>
            {
                blogposts() && blogposts().length > 0 ?
            <For each={blogposts()}>
                {(blogpost) => {
                    const formattedDate = new Date(blogpost.date).toLocaleDateString("hu-HU", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    });
                    return (
                    <BlogPostBar
                        id={blogpost.id}
                        title={blogpost.title}
                        date={formattedDate}
                        post={blogpost.post}
                        refreshBlogposts={refetch}
                        ></BlogPostBar>
                    )
                }
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
                <button class="bg-blue-600 text-white px-4 py-2 mt-4 rounded hover:bg-blue-800" onclick={async () => { await addBlogPost()}}>Hozzáadás</button>
            </ModalWindow>
            : null }
        </div>
    );
}