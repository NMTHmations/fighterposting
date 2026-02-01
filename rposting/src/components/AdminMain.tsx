import { createSignal, JSX, on, onCleanup, onMount } from "solid-js";
import { Menu, X } from 'lucide-solid';
import { useNavigate } from "@solidjs/router";

interface MainLayoutProps {
    is_logged_in: boolean;
    children: JSX.Element;
}

export default function MainLayout(props: MainLayoutProps) {

    const navigate = useNavigate();

    const LogOut = async () => {
        const response = await fetch(import.meta.env.VITE_LOGOUT, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        console.log(response.text());
        if (response.ok) {
            navigate("/admin");
        } else {
            alert("Failed to log out");
        }
    };

    return (
        <div class="flex flex-col items-center min-h-screen bg-gray-100 z-10">
            <div class="bg-[#30383d] w-full h-16 flex items-center w-screen z-5">
                <div class="p-2 flex flex-row w-full items-center">
                    <h1 class="flex items-center justify-between w-full">
                        <a href="/">
                        <button class="text-white text-2xl font-bold hover:text-[#fd8100]">
                            <span class="text-[#fd8100]">Fighter</span> Posting <span class="text-[10px]">alfa</span>
                            </button>
                            </a>
                            {props.is_logged_in ? <><span class="text-white text-2xl font-bold justify-end">Admin Panel</span>
                            </> :
                            <>
                            <div class="flex justify-end items-center">
                                <a href="/admin/main"><button class="text-white px-4 py-2 hover:text-[#ff6004] hover:underline hover:decoration-3 hover:underline-offset-4">Admin Panel</button></a>
                                <button class="text-white bg-[#ff6004] hover:bg-[#df5200] rounded-lg px-4 py-2 justify-end" onclick={LogOut}>Kijelentkezés</button>
                            </div>
                            </>
                            }
                    </h1>
                </div>
            </div>
            {props.children}
        </div>
    );
}