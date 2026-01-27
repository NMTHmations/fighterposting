import { Show, For, createResource, createSignal } from "solid-js";
import MainLayout from "../components/MainLayout";
import orange from "../img/orange.webp";

const fetchReviews = async () => {
  const response = await fetch(import.meta.env.VITE_GET_SMS);
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
                        <h2 class="text-2xl font-bold mb-4 text-center">SMS-ek</h2>
                        <p class="mb-2">Nincs Menczer SMS :o.</p>
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
                                    <div class="flex flex-col md:rounded-lg shadow-lg bg-white p-6 w-[100%] min-w-[300px] md:w-[60%] md:min-w-[400px] mt-4 mb-6">
                                        <h2 class="text-2xl font-bold mb-4 text-center">SMS-ek</h2>
                                    </div>
                                    <For each={data()[getPage() - 1]}>
                                                {(sms) => (
                                                    sms.linkType === "FB" || sms.linkType === "Facebook" ?
                                                    <>
                                                    <div class="flex flex-col md:rounded-lg shadow-lg bg-white w-[100%] min-w-[300px] md:w-[60%] md:p-4 md:min-w-[400px] mb-6">
                                                            <div class="fb-post" data-href={`${sms.link}`} data-width="400" data-show-text="true"></div>
                                                    </div>
                                                    </>
                                                    :
                                                    <></>
                                                )}
                                    </For>
                                    <div class="flex flex-col md:rounded-lg shadow-lg bg-white p-6 w-[100%] min-w-[300px] md:w-[60%] md:min-w-[400px] mb-6">
                                    </div>
                                </Show>
                    </>
                }
            </div>
        </MainLayout>
    );
}