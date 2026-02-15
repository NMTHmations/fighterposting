import {Trash} from 'lucide-solid';

interface SMSBarProps {
    date: string;
    message: string;
    id: number;
    setIsRefetch: any;
}
export default function SMSBar(props: SMSBarProps){

    const deleteSMS = async (id) => {
        const response = await fetch(import.meta.env.VITE_API_URL +`fighter/sms/delete/${id}/`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.ok) {
            alert("SMS deleted successfully");
            props.setIsRefetch(true);
        } else {
            alert("Failed to delete SMS");
        }
    };

    return (
        <div class="flex flex-row border-b border-gray-300">
        <div class="w-[25%] p-4 overflow-hidden">
            <p>{props.date}</p>
        </div>
        <div class="w-full p-4 w-[65%]">
            <div class="bg-gray-100 p-4 rounded-lg shadow break-words" innerHTML={props.message}></div>
        </div>
        <div class="w-[10%] p-4 overflow-hidden text-right">
            <button class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800" onClick={() => deleteSMS(props.id)}><Trash size={15}/></button>
        </div>
        </div>
    );
}