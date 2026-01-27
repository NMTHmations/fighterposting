import MainLayout from "../components/MainLayout";
import {XIcon} from 'lucide-solid';
import Plate from "../components/Plate";

export default function Main() {
    return (
        <MainLayout>
            <div class="flex flex-col items-center justify-center flex-grow">
                <Plate type="small">
                    <h2 class="text-2xl font-bold mb-4"><XIcon class="inline-block mr-2 text-red-800" />Az oldal nem található</h2>
                    <p class="mb-2">Sajnáljuk, de a keresett oldal (vagy facebookos harc) nem tálalható.</p>
                    <a href="/"><button class="mt-4 rounded bg-[#ff6004] shadow-md text-white text-center p-4 hover:shadow-sm hover:bg-[#df5200] w-full">Vissza a főoldalra</button></a>
                    </Plate>
            </div>
        </MainLayout>
    );
}