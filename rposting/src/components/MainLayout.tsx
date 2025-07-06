import { JSX } from "solid-js";

interface MainLayoutProps {
    children: JSX.Element;
}

export default function MainLayout(props: MainLayoutProps) {
    return (
        <div class="flex flex-col items-center h-screen bg-gray-100">
            <div class="bg-green-700 w-full h-16 flex items-center w-screen">
                <div class="md:mr-[20%] md:ml-[20%] p-2 flex flex-row w-full items-center">
                    <h1 class="text-white text-2xl font-bold">RemeczkiPosting</h1>
  
                    <div class="grow"></div> {/* this fills the space */}

                        <div class="flex justify-end items-center">
                            <div class="mr-2">
                            <button class="bg-white text-green-700 px-4 py-2 rounded hover:bg-gray-200">
                                Kommentek
                            </button>
                            </div>
                            <div class="mr-2">
                            <button class="bg-white text-green-700 px-4 py-2 rounded hover:bg-gray-200">
                                Küldj be kommentet
                            </button>
                            </div>
                            <div class="mr-2">
                            <button class="bg-white text-green-700 px-4 py-2 rounded hover:bg-gray-200">
                                Mi ez?
                            </button>
                            </div>
                        </div>
                    </div>
                </div>
                {props.children}
                <div class="bg-green-700 w-full h-16 flex items-center w-screen">
                    <div class="md:mr-[20%] md:ml-[20%] p-2 flex flex-row w-full items-center">
                        <p class="text-white pl-5">Copyright text</p>
                    </div>
                </div>
        </div>
    );
}