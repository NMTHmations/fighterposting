import { createSignal, onMount } from "solid-js";
import MainLayout from "../components/MainLayout";
import { useNavigate } from "@solidjs/router";

// Add grecaptcha to the Window interface for TypeScript
declare global {
    interface Window {
        grecaptcha?: {
            ready: (cb: () => void) => void;
            render: (container: string, options: { sitekey: string }) => void;
            getResponse: () => string;
        };
    }
}


export default function Main() {
    const [getFile, setFile] = createSignal<File | null>(null);
    const [imageSrc, setImageSrc] = createSignal<string | null>(null);
    const [uploaded, setUploaded] = createSignal(false);

    onMount(() => {
    });

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
                if (window.grecaptcha) {
                    window.grecaptcha.ready(() => {
                        window.grecaptcha.render("recaptcha-container", {
                            sitekey: import.meta.env.VITE_SITE_KEY,
                        });
                    });
                }
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

    const navigate = useNavigate();

    const handleSubmit = async () => {
        const title = (document.getElementById("title") as HTMLInputElement).value;
        if (!title || title.trim() === "") {
            alert("Kérlek, add meg a harci tevékenységet!");
            return;
        }
        if (!getFile()) {
            alert("Kérlek, tölts fel egy képet!");
            return;
        }

        // Prepare form data for submission
        const formData = new FormData();
        formData.append("title", title);
        formData.append("file", getFile()!);
        formData.append("g-recaptcha-response", window.grecaptcha?.getResponse() || "");

        fetch(import.meta.env.VITE_POST_REVIEW, {
            method: "POST",
            body: formData
        }).then(response => {
            if (response.ok) {
                setUploaded(false);
                setFile(null);
                setImageSrc(null);
                navigate("/success");
            } else {
                alert("Hiba történt a feltöltés során. Kérlek, próbáld újra.");
            }
        }).catch(() => {
            alert("Hiba történt a feltöltés során. Kérlek, próbáld újra.");
        });
        // Reset after submission
        setFile(null);
        setImageSrc(null);
        setUploaded(false);
    };

    return (
        <MainLayout>
            <div class="flex flex-col items-center justify-center flex-grow">
                <div class="flex flex-col rounded-lg shadow-lg bg-white p-6 w-[90%] min-w-[300px] md:w-[60%] md:min-w-[400px] mt-4 mb-4">
                    <h2 class="text-2xl font-bold mb-4 text-center">Harcos harcának feltöltése</h2>
                    { uploaded() == false ?
                    <>
                    <input type="file" id="file-upload" class="hidden" onChange={handleFileChange}/>
                    <label for="file-upload" class="mb-4 rounded bg-[#ff6004] shadow-md text-white text-center p-4 hover:shadow-sm hover:bg-[#df5200]">Feltöltés</label>
                    </>
                    :
                    <>
                    <img src={imageSrc()!} alt="Upload Icon" class="w-[100%]"/>
                    <input type="text" placeholder="Írd le a harci tevékenységet!" class="border border-gray-300 rounded p-2 w-full mt-4 mb-2" id="title"/>
                    <div class="overflow-auto">
                    <div id="recaptcha-container"></div>
                    </div>
                    <button class="bg-[#ff6004] text-white px-4 py-2 rounded hover:bg-[#df5200] w-full" onclick={handleSubmit}>Küldés</button>
                    </>
                    }
                    </div>
            </div>
        </MainLayout>
    );
}