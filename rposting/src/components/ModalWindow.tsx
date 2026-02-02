import { JSX } from "solid-js";
import {XIcon} from 'lucide-solid';

interface ModalWindowProps {
    setOpenAddWindow: any;
    children: JSX.Element;
}

export default function ModalWindow(props: ModalWindowProps) {
    return (
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div class="w-full min-w-md max-w-xl
              rounded-lg bg-white p-6
              shadow-xl
              animate-in fade-in zoom-in-95">
                <div class="mb-4"><XIcon class="w-4 h-4 ml-auto cursor-pointer hover:opacity-75" onClick={() => props.setOpenAddWindow(false)} /></div>
            {props.children}
            </div>
        </div>
    );
}