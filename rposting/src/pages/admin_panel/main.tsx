import { createEffect, onMount } from "solid-js";
import AdminMain from "../../components/AdminMain";
import { useNavigate } from "@solidjs/router";

export default function Main() {
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

    return (
        <AdminMain is_logged_in={false}>
            <div class="z-5 flex flex-col items-center justify-center flex-grow">
                <div class="flex flex-col rounded-lg shadow-lg bg-white w-[90%] md:w-full md:min-w-[600px] mt-4 mb-4">
                    <div class="bg-[#30383d] w-full h-16 flex items-center rounded-tl-lg rounded-tr-lg justify-center">
                    <h1 class="text-2xl text-center font-bold text-white">Menü</h1>
                    </div>
                    <div class="flex flex-row gap-4 md:min-w-[600px] pr-6 pl-6 pt-4 pb-4">
                    <a href="/admin/reviews" class="flex-1"><button class="bg-[#ff6004] text-white px-4 py-5 sm:px-2 sm:py-5 rounded hover:bg-[#df5200] w-full mt-4 mr-4">Átnézésre váró posztok</button></a>
                    <a href="/admin/posts" class="flex-1"><button class="bg-[#ff6004] text-white px-4 py-8 sm:px-2 sm:py-8 rounded hover:bg-[#df5200] w-full mt-4 mr-4">Posztok</button></a>
                    <a href="/admin/settings" class="flex-1"><button class="bg-[#ff6004] text-white px-4 py-8 sm:px-2 sm:py-8 rounded hover:bg-[#df5200] w-full mt-4">Beállítások</button></a>
                    </div>
                </div>
            </div>
        </AdminMain>
    );
}