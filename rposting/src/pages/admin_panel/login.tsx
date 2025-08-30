import { createEffect, createSignal, onMount } from "solid-js";
import AdminMain from "../../components/AdminMain";
import Lolo from "../../img/meszaros.jpg"
import {useNavigate } from "@solidjs/router";

export default function Main() {

    createEffect(async () => {
            const res = await fetch(import.meta.env.VITE_TOKEN_REFRESH_URL, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({})
            });
            if (res.status === 200) {
                navigate("/admin/main");
            }
        });

    const navigate = useNavigate();

    const [Error, setError] = createSignal(null);

    const handleLogin =(async () => {
        const email = (document.getElementById("email") as HTMLInputElement).value;
        const password = (document.getElementById("password") as HTMLInputElement).value;

        const response = await fetch(import.meta.env.VITE_CREATE_TOKEN_URL, {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ "email": email, 
                                               "password": password 
                                            }),
                    });
        if (!response.ok) {
            const raw = await response.text(); // read once
            let message = `Error ${response.status}`;
            try {
            const data = JSON.parse(raw); // attempt JSON parse
            message = data.detail || message;
            } catch {
            console.error('Non-JSON error body:', raw);
            }
            setError(message);
        }
        else {
            setError(null);
            navigate("/admin/main");
        }
        }
    );

    return (
        <AdminMain is_logged_in={true}>
            <div class="fixed top-0 left-0 w-full h-full z-0">
            <img src={Lolo} class="w-full h-full object-cover"/>
            </div>
            <div class="z-5 flex flex-col items-center justify-center flex-grow">
                <div class="flex flex-col rounded-lg shadow-lg bg-white p-6 w-[90%] min-w-[300px] md:w-[60%] md:min-w-[400px] mt-4 mb-4">
                    <h2 class="text-2xl font-bold mb-4 text-center">Belépés</h2>
                    {
                        Error() != null ?
                        <p class="text-red-500 mb-2">{Error()}</p>
                        :
                        <></>
                    }
                    <input type="text" placeholder="E-mail" class="border border-gray-300 rounded p-2 w-full mt-4 mb-2" id="email"/>
                    <input type="password" placeholder="Jelszó" class="border border-gray-300 rounded p-2 w-full mt-4 mb-2" id="password"/>
                    <button class="bg-[#ff6004] text-white px-4 py-2 rounded hover:bg-[#df5200] w-full mt-4" onclick={handleLogin}>Belépés</button>
                    </div>
            </div>
        </AdminMain>
    );
}