import { useNavigate } from "@solidjs/router";
import AdminMain from "../../components/AdminMain";
import { createEffect, createResource, createSignal, For, Show } from "solid-js";

const fetchReviews = async () => {
  const response = await fetch(import.meta.env.VITE_POSTS_URL,{
    method: "GET",
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
        
    const navigate = useNavigate();
        
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

    const deletePost = async (id) => {
        const response = await fetch(import.meta.env.VITE_API_URL +`delete-post/${id}/`, {
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
                                <div class="grow"></div>
                                </>
                            }
                            <p>{getPage()}</p>
                            { getPage() !== data().length ?
                                <button class="text-white px-4 py-2 hover:text-[#ff6004] hover:underline hover:decoration-3 hover:underline-offset-4" onClick={() => setPage(getPage() - 1)}>
                                    {getPage() + 1}
                                </button>
                            :
                            <>
                                <div class="grow"></div>
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
                                                    <button class="bg-red-700 text-white rounded-lg shadow-lg hover:bg-red-800 p-2 mt-4 w-full" onclick={() => deletePost(fight.id)}>Törlés</button>
                                                </div>
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
                                            <div class="grow"></div>
                                        </>
                                    }
                                    <p>{getPage()}</p>
                                    { getPage() !== data().length ?
                                        <button class="text-white px-4 py-2 hover:text-[#ff6004] hover:underline hover:decoration-3 hover:underline-offset-4" onClick={() => setPage(getPage() - 1)}>
                                            {getPage() + 1}
                                        </button>
                                    :
                                        <>
                                            <div class="grow"></div>
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