import {Trash, Pen} from 'lucide-solid';
import { createEffect, createSignal, JSX } from "solid-js";
import ModalWindow from './ModalWindow';
import Quill from 'quill';

interface BlogPostBarProps {
    id: number;
    title: string;
    post: string;
    date: string;
    refreshBlogposts?: any;
}

export default function BlogPostBar(props: BlogPostBarProps) {
    let quill: Quill;

    const [editContent, setEditContent] = createSignal(false);
    
    const deletePost = async (id) => {
    const response = await fetch(import.meta.env.VITE_API_URL +`blogposts/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (response.ok) {
        alert("Post deleted successfully");
        // You might want to add a refetch or state update here
        props.refreshBlogposts();
    }
    else {
        alert("Failed to delete post");
    }
};
    createEffect(() => {
        if (!editContent()) return;
        quill = new Quill('#editor', 
                    { modules: { toolbar: true }, 
                      theme: 'snow',
                    });
        quill.root.innerHTML = props.post;
    });

    const modifyPost = async () => {
        const formData = new FormData();
        formData.append("title", (document.getElementById("title") as HTMLInputElement).value);
        formData.append("post", quill.root.innerHTML);
        const response = await fetch(import.meta.env.VITE_API_URL +`blogposts/modify/${props.id}`, {
            method: "PATCH",
            credentials: "include",
            body: formData,
        });
        if (response.ok) {
            alert("Post updated successfully");
            // You might want to add a refetch or state update here
            props.refreshBlogposts();
            setEditContent(false);
        }
        else {
            alert("Failed to update post");
        }
    };


    return (
        <div class="flex flex-row border-b border-gray-300 p-4">
            <div>
            <h2>{props.title}</h2>
            <p>{props.date}</p>
            </div>
            <div class="text-right mt-2 ml-auto">
                <button class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800" onclick={() => deletePost(props.id)}><Trash size={16} /></button>
                <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 ml-2" onClick={() => setEditContent(true)}><Pen size={16} /></button>
            </div>
            {editContent() && (
            <ModalWindow setOpenAddWindow={setEditContent}>
                <div class="p-4">
                    <h1 class='text-xl mb-3 mt-1'>Szerkesztés</h1>
                    <input id="title" type="text" class="w-full p-2 border border-gray-300 rounded mb-4" value={props.title} />
                    <div id="editor" class="w-full p-2 border border-gray-300 rounded mb-4 h-40"></div>
                    <button class="bg-green-600 text-white px-4 py-2 mt-4 rounded hover:bg-green-800" onclick={() => modifyPost()}>Save Changes</button>
                </div>
            </ModalWindow>
            )}
        </div>
    );
}