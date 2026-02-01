import { createEffect, createSignal } from "solid-js";
import SMSBar from "../../../components/SMSBar";
import ModalWindow from "../../../components/ModalWindow";

export default function SMSManager() {

    const [SMSList, setSMSList] = createSignal<Array<{id: number, date: string, message: string}>>([]);
    const [isRefetch, setIsRefetch] = createSignal(true);
    const [showWindow, setShowWindow] = createSignal(false);

    const getAllSMS = async () => {
        const response = await fetch(import.meta.env.VITE_API_URL + `fighter/sms/`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) throw new Error("Failed to fetch");
        const promise = await response.json();
        console.log(promise);
        setSMSList(promise);
        return promise;
    };

    const addSMS = async () => {
        const formData = new FormData();
            const message = (document.getElementById("smsMessage") as HTMLInputElement).value;
            const postLink = (document.getElementById("postLink") as HTMLInputElement).value;
            const postType = (document.getElementById("postType") as HTMLInputElement).value;
            const postDate = (document.getElementById("postDate") as HTMLInputElement).value;
            if (!message || message.trim() === "") {
                alert("Az üzenet mező nem lehet üres.");
                return;
            }
            if (!postLink || postLink.trim() === "") {
                alert("A poszt link mező nem lehet üres.");
                return;
            }
            if (!postType || postType.trim() === "") {
                alert("A poszt típus mező nem lehet üres.");
                return;
            }
            const now = Date.now();
            formData.append("date", postDate || `${new Date(now).getFullYear()}-${(new Date(now).getMonth()+1).toString().padStart(2, '0')}-${new Date(now).getDate().toString().padStart(2, '0')}`);
            formData.append("message", message);
            formData.append("link", postLink);
            formData.append("type", postType);
            console.log(formData.get("message"));
            console.log(formData.get("link"));
            console.log(formData.get("date"));
            console.log(formData.get("type"));
            const response = await fetch(import.meta.env.VITE_API_URL + `fighter/sms/add/`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });
            if (response.ok) {
                alert("SMS-ek sikeresen hozzáadva");
                setIsRefetch(true);
                setShowWindow(false);
            } else {
                alert("SMS-ek hozzáadása sikertelen");
            }
        };

    createEffect(() => {
        if (isRefetch())
        {
            setIsRefetch(false);
            getAllSMS();
        }
    });


    return (
        <div>
            <h1 class="text-2xl font-bold mb-4">SMS Kezelő</h1>
            {SMSList().length > 0 ?
            SMSList().map((sms) => (
                <SMSBar id={sms.id} date={sms.date} message={sms.message} setIsRefetch={setIsRefetch}/>
            ))
        :
        <p class="text-center mt-10 mb-10">Nincs megjeleníthető SMS.</p>}
        <button class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800 mt-4" onclick={() => setShowWindow(true)}>SMS-ek hozzáadása</button>
        { showWindow() ?
        <ModalWindow setOpenAddWindow={setShowWindow}>
            <h1 class="text-xl font-bold mb-4">SMS-ek hozzáadása</h1>
            <p>Üzenet</p>
            <textarea class="w-full h-32 p-2 border border-gray-300 rounded mb-4" id="smsMessage"></textarea>
            <p>Poszt link:</p>
            <input type="text" id="postLink" class="border border-gray-300 rounded-md p-2 w-full mb-4" placeholder="Poszt link" />
            <p>Kelt:</p>
            <input type="date" id="postDate" class="border border-gray-300 rounded-md p-2 w-full mb-4" />
            <p>Poszt típusa:</p>
            <select id="postType" class="border border-gray-300 rounded-md p-2 w-full mb-4">
                <option value="FB">Facebook</option>
                <option value="IG">Instagram</option>
                <option value="TK">TikTok</option>
                <option value="TH">Threads</option>
                <option value="YT">YouTube</option>
                <option value="X">X (Twitter)</option>
            </select>
            <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800" onclick={async () => {
                await addSMS();
            }}>Hozzáadás</button>
        </ModalWindow>
        : null }
        </div>
    );
}