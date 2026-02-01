import { createEffect, createSignal, JSX } from "solid-js";
import TokenManagerBar from "../../../components/tokenManagerBar";
import {Plus} from 'lucide-solid';
import ModalWindow from "../../../components/ModalWindow";

export default function tokenManagerBar() {
    const [isRefetch, setIsRefetch] = createSignal(true);
    const [openAddWindow, setOpenAddWindow] = createSignal(false);
    const [tokenValue, setTokenValue] = createSignal<string>("");

    const AllTokens = async () => {
        const response = await fetch(import.meta.env.VITE_API_URL +`devicetoken/`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) throw new Error("Failed to fetch");
        const promise = await response.json();
        console.log(promise);
        return promise;
    };

    const AddToken = async (name: string, ttl: Date) => {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("ttl", `${ttl.getFullYear()}-${String(ttl.getMonth() + 1).padStart(2,'0')}-${String(ttl.getDate()).padStart(2,'0')}`);
        console.log(formData.get("name"));
        console.log(formData.get("ttl"));
        const response = await fetch(import.meta.env.VITE_API_URL +`devicetoken/add`, {
            method: "POST",
            credentials: "include",
            body: formData
        });
        if (response.ok) {
            response.json().then(data => {
                console.log(data.order_no);
                getToken(data.order_no);
            });
            setIsRefetch(true);
        } else {
            alert("Failed to add token");
            response.text().then(text => console.log(text));
        }
    };

    const getToken = async (orderNo: number) => {
        const response = await fetch(import.meta.env.VITE_API_URL +`devicetoken/${orderNo}/`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) throw new Error("Failed to fetch");
        const promise = await response.json();
        setTokenValue(promise.token);
        return promise;
    };


    const [data, setData] = createSignal([]);
    
    const fetchTokens = async () => {
        const tokens = await AllTokens();
        console.log(tokens);
        setData(tokens || []);
    };

    createEffect(() => {
        if (isRefetch()) {
            fetchTokens();
            setIsRefetch(false);
        }
    });

    return (
        <div>
            { data().length > 0 ?
                data().map((token) => (
                        <TokenManagerBar id={token.id} name={token.name} ttl={token.TTL} setIsRefetch={setIsRefetch} />
                    ))
                :
                <p class="ml-6 mb-5">Nincsenek mentett tokenek.</p>
            }
            <button class="bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 px-4 py-2 mt-4 mb-4 ml-8" onclick={() => setOpenAddWindow(true)}><Plus class="w-4 h-4 mr-2 mb-1 inline"/>Hozzáadás</button>
            {
                openAddWindow() ?
                <ModalWindow setOpenAddWindow={setOpenAddWindow}>
                    <h1 class="text-xl font-bold mb-4">Új token hozzáadása</h1>
                    <p class="mb-2">Token neve:</p>
                    <input type="text" id="tokenName" class="border border-gray-300 rounded-md p-2 w-full mb-4" placeholder="Token neve" />
                    <p class="mb-2">TTL (élettartam):</p>
                    <input type="date" id="tokenTTL" class="border border-gray-300 rounded-md p-2 w-full mb-4" />
                    <button class="bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 px-4 py-2 mt-4 mb-4 ml-65" onclick={() => {
                        const nameInput = document.getElementById("tokenName") as HTMLInputElement;
                        const ttlInput = document.getElementById("tokenTTL") as HTMLInputElement;
                    
                        const raw = ttlInput.value || Date.now();
                        const ttl = new Date(raw);
                    
                        if (isNaN(ttl.getTime())) {
                          alert("Érvénytelen dátum!");
                          return;
                        }

                        if (nameInput && ttlInput) {
                            const name = nameInput.value;
                            AddToken(name, ttl);
                            setOpenAddWindow(false);
                        }
                    }
                }><Plus class="w-4 h-4 mr-2 mb-1 inline"/>Hozzáadás</button>
                </ModalWindow>
                :
                <></>
            }
            {
                tokenValue() ?
                <ModalWindow setOpenAddWindow={setTokenValue}>
                    <h1 class="text-xl font-bold mb-4">Token hozzáadva</h1>
                    <p class="mb-4">Az új token sikeresen hozzáadva. A token:</p>
                    <p class="font-mono bg-gray-200 p-2 rounded overflow-scroll">{tokenValue()}</p>
                    <p class="mt-4 text-sm color-gray-600">Kérjük, másolja ki és tárolja biztonságosan ezt a tokent, mert később nem lesz elérhető!</p>
                    <button class="bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 px-4 py-2 mt-4 mb-4 ml-65" onclick={() => setTokenValue(null)}>Bezárás</button>
                </ModalWindow>
                :
                <></>
            }
        </div>
    );
}
