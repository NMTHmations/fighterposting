import { createEffect, createSignal, onMount } from "solid-js";
import AdminMain from "../components/AdminMain";
import Lolo from "../img/meszaros.jpg"
import {useNavigate } from "@solidjs/router";

export default function Main() {

    return (
        <div class="flex flex-col items-center min-h-screen bg-gray-100 z-10">
            <div class="fixed top-0 left-0 w-full h-full z-0">
            <img src={Lolo} class="w-full h-full object-cover"/>
            </div>
            <div class="z-5 flex flex-col items-center justify-center flex-grow">
                <div class="flex flex-col rounded-lg shadow-lg bg-white p-6 w-[90%] min-w-[300px] md:w-[60%] md:min-w-[400px] mt-4 mb-4">
                    <h2 class="text-2xl font-bold mb-4 text-center">Az oldal jelenleg karbantartás alatt van</h2>
                </div>
            </div>
        </div>
    );
}