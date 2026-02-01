import { createSignal, JSX, on, onCleanup, onMount } from "solid-js";
import { Menu, X } from 'lucide-solid';

interface MainLayoutProps {
    children: JSX.Element;
}

export default function MainLayout(props: MainLayoutProps) {
    const [displayWidth, setDisplayWidth] = createSignal(window.innerWidth);
    const [isMenuOpen, setIsMenuOpen] = createSignal(false);

    onMount(() => {
        window.addEventListener("resize", () => {
            setDisplayWidth(window.innerWidth);
        });
    });

    return (
        <div class="flex flex-col items-center min-h-screen bg-gray-100">
            <div class="bg-[#30383d] w-full h-16 flex items-center w-screen">
                <div class="md:mr-[20%] md:ml-[20%] p-2 flex flex-row w-full items-center">
                    <h1>
                        <a href="/">
                        <button class="text-white text-2xl font-bold hover:text-[#fd8100]">
                            <span class="text-[#fd8100]">Fighter</span> Posting <span class="text-[10px]">alfa</span>
                            </button>
                            </a>
                    </h1>
  
                     <div class="grow"></div>{/* this fills the space */}
                    { displayWidth() > 1024 ?
                    <>
                    <div class="flex justify-end items-center">
                            <div class="mr-2">
                                <a href="/fights">
                            <button class="text-white px-4 py-2 hover:text-[#ff6004] hover:underline hover:decoration-3 hover:underline-offset-4">
                                Harcok
                            </button>
                            </a>
                            </div>
                            <div class="mr-2">
                                <a href="/upload">
                            <button class="text-white px-4 py-2 hover:text-[#ff6004] hover:underline hover:decoration-3 hover:underline-offset-4">
                                Küldj be harcot
                            </button>
                            </a>
                            </div>
                            <div class="mr-2">
                                <a href="/what-is-this">
                            <button class="text-white px-4 py-2 hover:text-[#ff6004] hover:underline hover:decoration-3 hover:underline-offset-4">
                                Mi ez?
                            </button>
                            </a>
                            </div>
                        </div>
                        </>
                        :
                        <>
                        { isMenuOpen() ?
                        <div class="flex justify-end items-center">
                            <button class="text-white px-4 py-2 hover:text-[#ff6004] hover:underline hover:decoration-3 hover:underline-offset-4" onClick={() => setIsMenuOpen(false)}>
                                <X></X>
                            </button>
                        </div>
                        :
                        <div class="flex justify-end items-center">
                            <button class="text-white px-4 py-2 hover:text-[#ff6004] hover:underline hover:decoration-3 hover:underline-offset-4" onClick={() => setIsMenuOpen(true)}>
                                <Menu></Menu>
                            </button>
                        </div>
                        }
                        </>
                    }
                    </div>
                </div>
                { isMenuOpen() && displayWidth() <= 1024 ?
                    <div class="bg-[#30383d] w-full h-auto flex items-center w-screen">
                        <div class="md:mr-[20%] md:ml-[20%] p-2 flex flex-col w-full items-center">
                            <a href="/fights">
                            <button class="text-white px-4 py-2 hover:text-[#ff6004] hover:underline hover:decoration-3 hover:underline-offset-4">
                                Harcok
                            </button>
                            </a>
                            <a href="/upload">
                            <button class="text-white px-4 py-2 hover:text-[#ff6004] hover:underline hover:decoration-3 hover:underline-offset-4">
                                Küldj be harcot
                            </button>
                            </a>
                            <a href="/what-is-this">
                                <button class="text-white px-4 py-2 hover:text-[#ff6004] hover:underline hover:decoration-3 hover:underline-offset-4">
                                    Mi ez?
                                </button>
                            </a>
                        </div>
                    </div>
                    :
                    <>
                    </>
                }
                {props.children}
                <div class="bg-[#30383d] w-full h-16 flex items-center w-screen">
                    <div class="md:mr-[20%] md:ml-[20%] p-2 flex flex-row w-full items-center">
                        <p class="text-white pl-5">Copyright &#169; {new Date().getFullYear()} FighterPosting</p>
                    </div>
                </div>
        </div>
    );
}