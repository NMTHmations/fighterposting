import { createEffect, createSignal } from "solid-js";
import SMSBar from "../../../components/SMSBar";
import ModalWindow from "../../../components/ModalWindow";
import { Plus, User, ImageIcon, XIcon } from "lucide-solid";

export default function SMSManager() {

    const [SMSList, setSMSList] = createSignal<Array<{id: number, date: string, message: string}>>([]);
    const [isRefetch, setIsRefetch] = createSignal(true);
    const [showWindow, setShowWindow] = createSignal(false);
    const [Propagandist, setPropagandist] = createSignal(false);
    const [getFile, setFile] = createSignal<File | null>(null);
    const [imageSrc, setImageSrc] = createSignal<string | null>(null);
    const [uploaded, setUploaded] = createSignal(false);

    const handleFileChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
            const file = target.files[0];
            if (["image/png","image/jpeg","image/jpg","image/gif"].includes(file.type) && file.size <= 5 * 1024 * 1024) {
                setFile(file);
                const reader = new FileReader();
                reader.onload = () => {
                    setImageSrc(reader.result as string);
                };
                reader.readAsDataURL(file);
                setUploaded(true);
            }
            else {
                if (file.size > 5 * 1024 * 1024) {
                    alert("A feltöltött fájl mérete túl nagy! Maximum 5MB lehet.");
                }
                else if (!["image/png","image/jpeg","image/jpg","image/gif"].includes(file.type)) {
                    alert("Csak az alábbi típusú képfájlokat tölthetsz fel: PNG, JPEG/JPG, GIF.");
                }
                setFile(null);
                setImageSrc(null);
                setUploaded(false);
            }
        }
        else{
            setFile(null);
            setUploaded(false);
        }
    };

    const removeUpload = () => {
        setFile(null);
        setImageSrc(null)
        setUploaded(false);
    }

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
            <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 mt-4" onClick={() => setPropagandist(true)}><Plus/></button>
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
        {
            Propagandist() ?
            <ModalWindow setOpenAddWindow={setPropagandist}>
                <h1 class="text-xl font-bold mb-4">Propagandista hozzáadása</h1>
                <div class="flex flex-row">
                <div class="w-1/2 flex flex-col justify-center items-center">
                    { uploaded() === true ?
                    <img src={imageSrc()!} class="w-[100%] p-2"></img>
                    :
                    <User class="w-32 h-32 text-gray-600" />
                    }
                </div>
                <div class="w-1/2">
                    <p>Név:</p>
                    <input type="text" id="propagandistName" class="border border-gray-300 rounded-md p-2 w-full mb-4" placeholder="Propagandista neve" />
                    <p class="mb-4">Propagandista fotója:</p>
                    { uploaded() == false ? 
                    <>
                    <input type="file" id="file-upload" class="hidden" onChange={handleFileChange}/>
                    <label for="file-upload" class="inline-block mb-2 w-full rounded bg-[#ff6004] shadow-md text-white text-center p-2 hover:shadow-sm hover:bg-[#df5200]">Kép feltöltése</label>
                    </>
                    :
                    <div class="flex flex-row">
                    <p><ImageIcon class="inline-block pr-2 pb-1"/>{getFile()?.name}</p>
                    <button class="ml-2 rounded w-6 hover:bg-gray-300" onclick={removeUpload}><XIcon/></button>
                    </div>
                    }
                </div>
                </div>
                <div class="w-full flex justify-start">
                    <button class="mb-2 rounded bg-[#ff6004] shadow-md text-white text-center p-2 hover:shadow-sm hover:bg-[#df5200]">Mentés</button>
                </div>
            </ModalWindow>
            :
            null
        }
        </div>
    );
}