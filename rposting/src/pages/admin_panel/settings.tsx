import { createEffect, onMount } from "solid-js";
import AdminMain from "../../components/AdminMain";
import { useNavigate } from "@solidjs/router";
import TokenManager from "./services/TokenManager";

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
            if (res.status !== 200) {
                navigate("/admin");
            }
        });

    return (
        <AdminMain is_logged_in={false}>
            <div class="z-5 flex flex-col items-center justify-center flex-grow ">
                <div class="flex flex-col rounded-lg shadow-lg bg-white w-[90%] md:w-full md:min-w-[800px] mt-4 mb-4 overflow-hidden">
                    <div class="bg-[#30383d] w-full h-16 flex items-center rounded-tl-lg rounded-tr-lg justify-center">
                    <h1 class="text-2xl text-center font-bold text-white">Beállítások</h1>
                    </div>
                    <h1 class="text-2xl mt-2 mb-2 ml-4">SMS Tokenek kezelése</h1>
                    <TokenManager />
                </div>
            </div>
        </AdminMain>
    );
}