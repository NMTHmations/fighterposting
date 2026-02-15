import {JSX} from "solid-js";
import { ChevronLeft } from "lucide-solid";

interface MessageHeaderProps {
    children: JSX.Element;
}

export default function MessageHeader(props: MessageHeaderProps) {
    return (
        <div class="flex flex-col min-h-screen bg-gray-100 pt-16">
            <div class="fixed top-0 left-0 z-50 bg-[#30383d] w-full h-16 flex items-center w-screen">
                <div>
                    <a href="/">
                    <button class="text-white text-2xl font-bold hover:text-[#fd8100] ml-2">
                        <ChevronLeft class="w-6 h-6" />
                    </button>
                    </a>
                </div>
                <div class="grow"></div>{/* this fills the space */}
                <div class="flex flex-col items-center justify-center">
                <img 
                  src="../../public/menczergeci.jpeg" 
                  alt="profile"
                  class="w-10 h-10 rounded-full object-cover mr-5"
                />
                <div class="flex flex-row items-center">
                <p class="text-white font-bold">
                    HK
                </p>
                <p class="text-gray-400 ml-2 text-[12px] mr-3">
                    Büdösszájú Menczer
                </p>
                </div>
                </div>
                <div class="grow"></div>{/* this fills the space */}
            </div>
            {props.children}
        </div>
        );
};