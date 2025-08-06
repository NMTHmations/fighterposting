import { useNavigate } from "@solidjs/router";
import AdminMain from "../../components/AdminMain";
import { createEffect, createResource, createSignal, For, Show } from "solid-js";

const fetchReviews = async () => {
  const response = await fetch(import.meta.env.VITE_REVIEWS_URL,{
    method: "GET",
    credentials: "include",
    headers: {
        "Content-Type": "application/json",
  },
  });
  if (!response.ok) throw new Error("Failed to fetch");
  const promise = response.json();
  const result = promise.then(result => {return result} )
  return await JSON.parse(await result);
};

export default function Main() {

    const [data, { refetch }] = createResource(fetchReviews);

    const [getPage, setPage] = createSignal(1);

    const [ShowText, setShowText] = createSignal([]);
        
    const navigate = useNavigate();

    const deletePost = async (id) => {
        const response = await fetch(import.meta.env.VITE_API_URL + `delete-review/${id}/`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.ok) {
            alert("Post deleted successfully");
            refetch();
        } else {
            alert("Failed to delete post");
        }
    };


    const AddPost = async (id) => {
        const formData = new FormData();
        formData.append("id", id);
        const response = await fetch(import.meta.env.VITE_POST, {
            method: "POST",
            credentials: "include",
            body: formData
        });
        if (response.ok) {
            alert("Post added successfully");
            refetch();
        } else {
            alert("Failed to delete post");
        }
    };

    const ModifyPost = async (id, title) => {
        const formData = new FormData();
        formData.append("id", id);
        formData.append("title", title);
        const response = await fetch(import.meta.env.VITE_MODIFY_REVIEW_TITLE_URL, {
            method: "PATCH",
            credentials: "include",
            body: formData
        });
        if (response.ok) {
            alert("Post added successfully");
            refetch();
        } else {
            alert("Failed to modify the post's title");
        }
    };
        
    createEffect(async () => {
                const res = await fetch(import.meta.env.VITE_TOKEN_REFRESH_URL, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({})
                });
                console.log(await res.json());
                if (res.status !== 200) {
                    navigate("/admin");
                }
    });
    
    return (
        <AdminMain is_logged_in={false}>
            <div class="z-5 flex flex-col items-center justify-center flex-grow">
                {
                    (!data() || data().length === 0) ?
                    <>
                        <div class="flex flex-col rounded-lg shadow-lg bg-white p-6 w-[90%] min-w-[300px] md:w-[60%] md:min-w-[400px] mt-4 mb-6">
                                <h2 class="text-2xl font-bold mb-4 text-center">Csaták</h2>
                                <p class="mb-2">Nincsenek elérhető csaták.</p>
                        </div>
                    </>
                    :   
                     <>
                        <Show when={data()} fallback={
                        <>
                            <div class="flex flex-col rounded-lg shadow-lg bg-white p-6 w-[90%] min-w-[300px] md:w-[60%] md:min-w-[400px] mt-4 mb-6">
                                <p>Loading...</p>
                            </div>
                        </>
                        }>
                        <div class="flex flex-col rounded-lg shadow-lg bg-white p-6 w-[90%] min-w-[300px] md:w-[60%] md:min-w-[400px] mt-4 mb-6">
                            <h2 class="text-2xl font-bold mb-4 text-center">Várakozásra váró küzdelmek</h2>
                            <div class="flex flex-row justify-between items-center ">
                            { getPage() > 1 ?
                                            <button class="px-4 py-2 hover:text-[#ff6004] hover:underline hover:decoration-3 hover:underline-offset-4" onClick={() => setPage(getPage() - 1)}>
                                            {getPage() - 1}
                                            </button>
                                        :
                                        <>
                                        <div class="gap"></div>
                                        </>
                                        }
                                        <p>{getPage()}</p>
                                        { getPage() !== data().length ?
                                            <button class="px-4 py-2 hover:text-[#ff6004] hover:underline hover:decoration-3 hover:underline-offset-4" onClick={() => setPage(getPage() + 1)}>
                                            {getPage() + 1}
                                            </button>
                                        :
                                        <>
                                        <div class="gap"></div>
                                        </>
                                        }
                                </div>
                            </div>
                            <For each={data()[getPage() - 1]}>
                                {(fight) => (
                                        <div class="flex flex-col rounded-lg shadow-lg bg-white p-4 w-[90%] min-w-[300px] md:w-[60%] md:min-w-[400px] mb-6">
                                                <h3 class="text-xl font-semibold mb-3">{fight.title}</h3>
                                                <p class="mb-2"><img src={"http://127.0.0.1:8000/"+fight.image_source}></img></p>
                                                <div class="flex flex-row justify-between items-center">
                                                    <button class="bg-red-700 text-white rounded-lg shadow-lg hover:bg-red-800 p-2 mt-4 w-full mr-3" onclick={() => {deletePost(fight.id)}}>Törlés</button>
                                                    {
                                                        ShowText().includes(fight.id) ?
                                                        <button class="bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 p-2 mt-4 w-full mr-3" onclick={() => setShowText(ShowText().filter(id => id !== fight.id))}>Mégse</button>
                                                        :
                                                        <button class="bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 p-2 mt-4 w-full mr-3" onclick={() => setShowText([...ShowText(), fight.id])}>Módosítás</button>
                                                    }
                                                    <button class="bg-green-700 text-white rounded-lg shadow-lg hover:bg-green-800 p-2 mt-4 w-full" onclick={() => {AddPost(fight.id)}}>Posztolás</button>
                                                </div>
                                                {
                                                        ShowText().includes(fight.id) ?
                                                        <>
                                                        <div class="flex flex-row justify-between items-center">
                                                            <input type="text" placeholder="Új cím" class="border border-gray-300 rounded p-2 w-full mt-4 mr-2 mb-2" id="title"/>
                                                            <button class="bg-green-700 text-white rounded-lg shadow-lg hover:bg-green-800 p-2 mt-4 w-[48%]" onclick={() => {ModifyPost(fight.id, (document.getElementById("title") as HTMLInputElement).value)}}>Módosítás</button>
                                                        </div>
                                                        </>
                                                        :
                                                        <></>
                                                }
                                        </div>
                                )}
                            </For>
                                <div class="flex flex-col rounded-lg shadow-lg bg-white p-6 w-[90%] min-w-[300px] md:w-[60%] md:min-w-[400px] mb-6">
                                <div class="flex flex-row justify-between items-center ">
                                    { getPage() > 1 ?
                                            <button class="px-4 py-2 hover:text-[#ff6004] hover:underline hover:decoration-3 hover:underline-offset-4" onClick={() => setPage(getPage() - 1)}>
                                            {getPage() - 1}
                                            </button>
                                        :
                                        <>
                                        <div class="gap"></div>
                                        </>
                                        }
                                        <p>{getPage()}</p>
                                        { getPage() !== data().length ?
                                            <button class="px-4 py-2 hover:text-[#ff6004] hover:underline hover:decoration-3 hover:underline-offset-4" onClick={() => setPage(getPage() + 1)}>
                                            {getPage() + 1}
                                            </button>
                                        :
                                        <>
                                        <div class="gap"></div>
                                        </>
                                        }
                                        </div>
                                </div>
                        </Show>
                    </>
                }
            </div>
        </AdminMain>
    );
}