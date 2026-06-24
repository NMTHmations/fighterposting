import { useNavigate } from "@solidjs/router";
import { Show, For, createResource, createSignal, createEffect, onMount } from "solid-js";

const fetchReviews = async () => {
  const response = await fetch(import.meta.env.VITE_GET_SMS);
  if (!response.ok) throw new Error("Failed to fetch");
  const promise = await response.json();
  console.log(promise);
  return [...promise].sort((a, b) => {
    const [ay, am, ad] = a.date.split("-").map(Number);
    const [by, bm, bd] = b.date.split("-").map(Number);

    const dateA = new Date(ay, am - 1, ad);
    const dateB = new Date(by, bm - 1, bd);

    return dateB - dateA; // newest first
  });
};

export default function Main() {

    const [data] = createResource(fetchReviews);
    const [getPage, setPage] = createSignal(1);

    createEffect(() => {
  if (!data()) return;

  const interval = setInterval(() => {
    if (window.FB) {
      window.FB.XFBML.parse();
      clearInterval(interval);
    }
  }, 100);

  return () => clearInterval(interval);
});

    const navigate = useNavigate();

    onMount(() => {
        if (window.outerWidth < 450) navigate("/messages");
    });

    return (
        <>
            <div class="flex flex-col items-center bg-gray-300 justify-center min-h-screen flex-grow w-screen">
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
                            <Show when={data} fallback={
                                <>
                                <div class="flex flex-col rounded-lg shadow-lg bg-white p-6 w-[90%] min-w-[300px] md:w-[60%] md:min-w-[400px] mt-4 mb-6">
                                <p>Loading...</p>
                                </div>
                                </>
                                }>
                                    <div class="flex flex-col rounded-lg shadow-lg bg-white w-[90%] min-w-[200px] md:w-[40%] md:p-4 p-2 md:min-w-[500px] mt-3 mb-6">
                                        <h2 class="text-2xl font-bold mb-4 text-center">Harcosok Klubja SMS-ek</h2>
                                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 justify-items-center items-stretch">
                                        <a href="/messages" class="w-full"><button class="rounded bg-[#ff6004] shadow-md text-white text-center p-4 h-full hover:shadow-sm hover:bg-[#df5200] w-full">SMS üzenetek Menczer Tomikával</button></a>
                                        <a href="/old_index" class="w-full"><button class="rounded bg-[#ff6004] shadow-md text-white text-center p-4 h-full hover:shadow-sm hover:bg-[#df5200] w-full mr-5">Tovább a FighterPostingra</button></a>
                                        </div>
                                    </div>
                                    <div class="columns-1 md:columns-1 lg:columns-2 mb-6">
                                    <For each={data()}>
                                                {(sms) => (
                                                    (sms.linkType === "FB" || sms.linkType === "Facebook") && sms.link !== "None" ?
                                                    <>
                                                    <div class="flex bg-white rounded-lg shadow-lg pt-4 pb-4 md:p-4 mb-6 break-inside-avoid text-center">
                                                        <div class="w-[350px] overflow-hidden">
                                                            <div class="fb-post" data-href={`${sms.link}`} data-width="350" data-show-text="true"></div>
                                                        </div>
                                                    </div>
                                                    </>
                                                    :
                                                    <></>
                                                )}
                                    </For>
                                    </div>
                                </Show>
                    </>
                }
            </div>
        </>
    );
}