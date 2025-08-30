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
            if (res.status !== 200) {
                navigate("/admin");
            }
        });

    return (
        <AdminMain is_logged_in={false}>
            <div class="z-5 flex flex-col items-center justify-center flex-grow">
                <div class="flex flex-col rounded-lg shadow-lg bg-white w-[90%] md:w-full md:min-w-[600px] mt-4 mb-4">
                    <div class="bg-[#30383d] w-full h-16 flex items-center rounded-tl-lg rounded-tr-lg justify-center">
                    <h1 class="text-2xl text-center font-bold text-white">Beállítások</h1>
                    </div>
                    <p class="text-xl mt-2 mb-2 ml-4">Jelenleg ez a funkció kialakítás alatt van</p>
                    {/*<div class="flex flex-row gap-4 md:min-w-[600px] pr-6 pl-6 pt-4 pb-4">
                    
                    </div>*/}
                </div>
            </div>
        </AdminMain>
    );
}