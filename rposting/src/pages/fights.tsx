import { Show, For, createResource, createSignal } from "solid-js";
import MainLayout from "../components/MainLayout";

const fetchReviews = async () => {
  const response = await fetch(import.meta.env.VITE_POSTS_URL);
  if (!response.ok) throw new Error("Failed to fetch");
  const promise = response.json();
  const result = promise.then(result => {return result} )
  return await JSON.parse(await result);
};

export default function Main() {

    const [data] = createResource(fetchReviews);
    const [getPage, setPage] = createSignal(1);

    return (
        <MainLayout>
            <div class="flex flex-col items-center justify-center flex-grow">
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
                                        <h2 class="text-2xl font-bold mb-4 text-center">Csaták</h2>
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
                                                        <a href={`/fight/${fight.id}`}><h3 class="text-xl font-semibold mb-3">{fight.title}</h3></a>
                                                        <p class="mb-2"><a href={`/fight/${fight.id}`}><img src={"http://127.0.0.1:8000/"+fight.image_source} class="rounded-lg shadow-lg w-full h-auto mb-1"></img></a></p>
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
        </MainLayout>
    );
}