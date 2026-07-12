import {JSX} from "solid-js";
import { ChevronLeft } from "lucide-solid";
import GecziMenczer from "../../public/menczergeci.jpeg";
import { PropagandistProperties } from "../../../interfaces/propagandistInterface";

interface MessageHeaderProps {
    selectedPropagandist: PropagandistProperties | null;
    setSelectedPropagandist: (propagandist: PropagandistProperties | null) => void;
    resetActualMessages: () => void;
    children: JSX.Element;
}

export default function MessageHeader(props: MessageHeaderProps) {
    const handleBackClick = () => {
        props.setSelectedPropagandist(null);
        props.resetActualMessages();
    };

    return (
        <div class="flex flex-col min-h-screen bg-gray-100 pt-16">
                <div class="fixed top-0 left-0 z-50 bg-[#30383d] w-full h-16 flex items-center w-screen">
                {props.selectedPropagandist ? <>    
                    <div>
                        <button class="text-white text-2xl font-bold hover:text-[#fd8100] ml-2" onClick={handleBackClick}>
                            <ChevronLeft class="w-6 h-6" />
                        </button>
                </div>
                <div class="grow"></div>{/* this fills the space */}
                <div class="flex flex-col items-center justify-center">
                <img
                  src={`${import.meta.env.VITE_API_URL}${props.selectedPropagandist?.fileUrl}`}
                  alt="profile"
                  class="w-10 h-10 rounded-full object-cover mr-5"
                />
                <div class="flex flex-row items-center">
                <p class="text-white font-bold">
                    HK
                </p>
                <p class="text-gray-400 ml-2 text-[12px] mr-3">
                    {props.selectedPropagandist?.name}
                </p>
                </div>
                </div>
                <div class="grow"></div>{/* this fills the space */}
                </>
                :
                <>
                <div class="grow"></div>
                <h1 class="text-white text-xl font-bold">Üzenetek propagandistáktól</h1>
                <div class="grow"></div>
                </>
            }
            </div>
            {props.children}
        </div>
        );
};