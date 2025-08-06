import { createResource, Show } from "solid-js";
import MainLayout from "../components/MainLayout";

const fetchReviews = async () => {
  const response = await fetch(import.meta.env.VITE_RECOMMENDED_URL);
  if (!response.ok) throw new Error("Failed to fetch");
  return await response.json();
};

export default function Main() {
    const [data] = createResource(fetchReviews);
    return (
        <MainLayout>
            <div class="flex flex-col items-center justify-center flex-grow">
                <div class="flex flex-col rounded-lg shadow-lg bg-white p-6 w-[90%] min-w-[300px] md:w-[60%] md:min-w-[400px] mt-4 mb-4">
                    <h1 class="text-2xl text-center">Üdv a Fighter Posting oldalon!</h1>
                    <div class="flex flex-col md:flex-row gap-4">
                    <a href="/upload" class="w-full"><button class="mt-4 rounded bg-[#ff6004] shadow-md text-white text-center p-4 hover:shadow-sm hover:bg-[#df5200] w-full mr-5">Harc feltöltése</button></a>
                    <a href="/fights" class="w-full"><button class="mt-4 rounded bg-[#ff6004] shadow-md text-white text-center p-4 hover:shadow-sm hover:bg-[#df5200] w-full">Harcok</button></a>
                    </div>
                </div>
                <Show when={data()} fallback={
                                                <>
                                                <div class="flex flex-col rounded-lg shadow-lg bg-white p-6 w-[90%] min-w-[300px] md:w-[60%] md:min-w-[400px] mt-4 mb-6">
                                                <p>Loading...</p>
                                                </div>
                                                </>
                                                }>
                                                    <div class="flex flex-col rounded-lg shadow-lg bg-white p-6 w-[90%] min-w-[300px] md:w-[60%] md:min-w-[400px] mt-4 mb-4">
                                                        <h2 class="text-2xl font-bold mb-4 text-center">Ajánlott poszt</h2>
                                                        <a href={`/fight/${data().id}`}><img src={"http://localhost:8000/" + data().title} alt="Recommended Post" class="rounded-lg shadow-lg w-full h-auto mb-4" /></a>
                                                    </div>
                                                </Show>
            </div>
        </MainLayout>
    );
}