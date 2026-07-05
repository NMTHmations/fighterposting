import { createEffect, createSignal } from "solid-js";
import SMSBar from "../../../components/SMSBar";
import ModalWindow from "../../../components/ModalWindow";
import { Plus, User, ImageIcon, XIcon, Trash } from "lucide-solid";
import { PropagandistProperties } from "../../../interfaces/propagandistInterface";

interface SMSProperties {
    id: number,
    date: string,
    message: string,
    link: string,
    linkType: string,
    senderId: number
}

export default function SMSManager() {

    const [SMSList, setSMSList] = createSignal<SMSProperties[]>([]);
    const [isRefetch, setIsRefetch] = createSignal(true);
    const [showWindow, setShowWindow] = createSignal(false);
    const [Propagandist, setPropagandist] = createSignal(false);
    const [getFile, setFile] = createSignal<File | null>(null);
    const [imageSrc, setImageSrc] = createSignal<string | null>(null);
    const [uploaded, setUploaded] = createSignal(false);
    const [PropagandistList, setPropagandistList] = createSignal<PropagandistProperties[]>([]);
    const [selectedPropagandists, selectPropagandists] = createSignal<number[]>([]);
    const [SMSToEdit, setSMSToEdit] = createSignal<SMSProperties | null>(null);

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

    const deletePropagandist = async (id: number) => {
        fetch(import.meta.env.VITE_API_URL + `sender/delete/${id}/`, {
            method: "DELETE",
            credentials: "include",
        }).then(
            (res) =>
            {
                if (res.ok)
                {
                    console.log("Propagandist deleted!");
                    fetchPropagandists();
                }
                else {
                    console.log("Propagandist could not be deleted!");
                }
            }
        ).catch((error) => {
            console.log(error)
        })
    }

    const removeUpload = () => {
        setFile(null);
        setImageSrc(null)
        setUploaded(false);
    }

    const createPropagandist = async () => {
        const formData = new FormData();
        const name = (document.getElementById("propagandistName") as HTMLInputElement).value;
        formData.append("name", name);
        formData.append("file", getFile()!);
        fetch(import.meta.env.VITE_API_URL + `sender/create/`, {
            method: "POST",
            credentials: "include",
            body: formData
        }).then((res) => {
            if (res.ok)
            {
                removeUpload();
                setPropagandist(false);
                fetchPropagandists();
            }
            else
            {
                console.log("Hiba történt!");
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    const fetchPropagandists = async () => {
        fetch(import.meta.env.VITE_API_URL + `sender/`, {
                method: "GET",
                credentials: "include"
            }
        ).then((res) => {
            if (res.ok)
            {
                console.log("Propagandists fetched")
                return res.json();
            }
            return null;
        }).then((results) => {
            const data = JSON.parse(results)
            if (data && Array.isArray(data))
            {
                const propagandists: PropagandistProperties[] = data.map((result: any) => ({
                    id: result.id ?? null,
                    name: result.name,
                    fileUrl: result.fileUrl ?? null,
                }));
                setPropagandistList(propagandists);
                console.log(propagandists);
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    const selectPropagandistHandler = (id: number) => {
        const currentSelection = selectedPropagandists();
        if (currentSelection.includes(id)) {
            selectPropagandists(currentSelection.filter(selectedId => selectedId !== id));
        } else {
            selectPropagandists([...currentSelection, id]);
        }
        getAllSMS();
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
            const propagandist = (document.getElementById("sender") as HTMLInputElement).value;
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
            if (propagandist !== "none")
            {
                formData.append("senderId",propagandist);
            }
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
    
    const editSMS = async (id: number) => {
        const smsToEdit = SMSList().find(sms => sms.id === id);
        if (smsToEdit) {
            setSMSToEdit(smsToEdit);
            setShowWindow(true);
            (document.getElementById("smsMessage") as HTMLInputElement).value = smsToEdit.message;
            (document.getElementById("postLink") as HTMLInputElement).value = smsToEdit.link;
            (document.getElementById("postType") as HTMLInputElement).value = smsToEdit.linkType;
            (document.getElementById("postDate") as HTMLInputElement).value = new Date(smsToEdit.date).toISOString().split('T')[0];
            (document.getElementById("sender") as HTMLInputElement).value = smsToEdit.senderId as unknown as string;
        } else {
            alert("SMS not found for editing.");
        }
    };

    const closeEditWindow = () => {
        setSMSToEdit(null);
        setShowWindow(false);
    };


    createEffect(() => {
        if (isRefetch())
        {
            setIsRefetch(false);
            fetchPropagandists();
            getAllSMS();
        }
    });

    const modifySMS = async () => {
        const formData = new FormData();
        const message = (document.getElementById("smsMessage") as HTMLInputElement).value;
        const postLink = (document.getElementById("postLink") as HTMLInputElement).value;
        const postType = (document.getElementById("postType") as HTMLInputElement).value;
        const postDate = (document.getElementById("postDate") as HTMLInputElement).value;
        const propagandist = (document.getElementById("sender") as HTMLInputElement).value;
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
        if (propagandist !== "none")
        {
            formData.append("senderId",propagandist);
        }
        console.log(formData.get("message"));
        console.log(formData.get("link"));
        console.log(formData.get("date"));
        console.log(formData.get("type"));
        const response = await fetch(import.meta.env.VITE_API_URL + `fighter/sms/modify/${SMSToEdit()?.id}/`, {
            method: "PATCH",
            credentials: "include",
            body: formData,
        });
        if (response.ok) {
            alert("SMS-ek sikeresen módosítva");
            setIsRefetch(true);
            setShowWindow(false);
            setSMSToEdit(null);
        } else {
            alert("SMS-ek módosítása sikertelen");
        }
    }


    return (
        <div>
            <h1 class="text-2xl font-bold mb-4">SMS Kezelő</h1>
            <h2 class="text-xl mt-2">Propagandisták</h2>
            <div class="flex flex-row flex-wrap">
                {
                    PropagandistList().map(element => (
                        <>
                            {selectedPropagandists().includes(element.id) ?
                            <button class="bg-blue-600 text-white px-4 py-2 rounded-l-lg hover:bg-blue-800 mt-2" onClick={() => selectPropagandistHandler(element.id)}>
                                {element.name}
                            </button>
                            :
                            <button class="bg-gray-600 text-white px-4 py-2 rounded-l-lg hover:bg-gray-800 mt-2" onClick={() => selectPropagandistHandler(element.id)}>
                                {element.name}
                            </button>
                            }
                            <button class="bg-red-600 text-white px-2 py-2 rounded-r-lg hover:bg-red-800 mt-2 mr-2" onclick={() => deletePropagandist(element.id)}><Trash/></button>
                        </>
                    ))
                }
                <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 mt-2" onClick={() => setPropagandist(true)}><Plus/></button>
            </div>
            <h2 class="text-xl mt-2">SMS-ek</h2>
            {SMSList().length > 0 ?
            SMSList().map((sms) => (
                selectedPropagandists().includes(sms.senderId) || selectedPropagandists().length === 0 ? 
                <SMSBar id={sms.id} date={sms.date} message={sms.message} setIsRefetch={setIsRefetch} openForEdit={editSMS}/>
                :
                null
                )
            )
        :
        <p class="text-center mt-10 mb-10">Nincs megjeleníthető SMS.</p>}
        <button class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800 mt-4" onclick={() => setShowWindow(true)}>SMS-ek hozzáadása</button>
        { showWindow() ?
        <ModalWindow setOpenAddWindow={closeEditWindow}>
            { SMSToEdit() ?
            <h1 class="text-xl font-bold mb-4">SMS-ek szerkesztése</h1>
            :
            <h1 class="text-xl font-bold mb-4">SMS-ek hozzáadása</h1>
            }
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
            <p>Küldő propagandista:</p>
            <select id="sender" class="border border-gray-300 rounded-md p-2 w-full mb-4">
                <option value="none"></option>
                { PropagandistList().map(
                    (propagandist) => (
                        <option value={propagandist.id}>{propagandist.name}</option>
                    )
                    )
                }
            </select>
            { SMSToEdit() ?
            <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800" onclick={async () => {
                await modifySMS();
            }}>Módosítás</button>
            :
            <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800" onclick={async () => {
                await addSMS();
            }}>Hozzáadás</button>}
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
                    <input type="file" id="file-upload-propagandist" class="hidden" onChange={handleFileChange}/>
                    <label for="file-upload-propagandist" class="inline-block mb-2 w-full rounded bg-[#ff6004] shadow-md text-white text-center p-2 hover:shadow-sm hover:bg-[#df5200]">Kép feltöltése</label>
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
                    <button class="mb-2 rounded bg-[#ff6004] shadow-md text-white text-center p-2 hover:shadow-sm hover:bg-[#df5200]" onclick={() => createPropagandist()}>Mentés</button>
                </div>
            </ModalWindow>
            :
            null
        }
        </div>
    );
}