import {Trash} from 'lucide-solid';

interface TokenManagerBarProps {
    id: number;
    name: string;
    ttl: string;
    setIsRefetch: any;
}

export default function tokenManagerBar(props: TokenManagerBarProps) {

    const deletePost = async (id) => {
        const response = await fetch(import.meta.env.VITE_API_URL +`devicetoken/delete/${id}/`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.ok) {
            alert("Post deleted successfully");
            props.setIsRefetch(true);
        } else {
            alert("Failed to delete post");
        }
    };
    
    return (
            <div class="flex flex-col items-center justify-center flex-grow">
            <div class="flex flex-row">
                <div class="bg-[#DED8CD] min-w-[500px] h-17 flex rounded-md mb-4 overflow-hidden">
                    <div class="flex flex-row">
                        <div class="w-[100px] flex justify-center items-center">
                            <p class="text-md mr-3 ml-3">{props.name}</p>
                        </div>
                        <div class="w-[300px]">
                        </div>
                        <div class="w-[100px] flex justify-center items-center">
                            <p class="mt-2 mr-2">{props.ttl}</p>
                        </div>
                    </div>
                </div>
                <div class="h-17 flex rounded-md mb-4 overflow-hidden">
                    <button class="bg-red-700 text-white rounded-lg shadow-lg hover:bg-red-800 p-2 mt-4 mb-2 ml-4" onclick={() => deletePost(props.id)}><Trash class="text-white" /></button>
                </div>
            </div>
        </div>
    );
}