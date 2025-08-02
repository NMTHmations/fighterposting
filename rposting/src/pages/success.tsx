import MainLayout from "../components/MainLayout";
import {CheckIcon} from 'lucide-solid';

export default function Main() {
    return (
        <MainLayout>
            <div class="flex flex-col items-center justify-center flex-grow">
                <div class="flex flex-col rounded-lg shadow-lg bg-white p-6 w-[90%] min-w-[300px] md:w-[60%] md:min-w-[400px] mt-4 mb-4">
                    <h2 class="text-2xl font-bold mb-4"><CheckIcon class="inline-block mr-2 text-green-800" />Sikeres feltöltés</h2>
                    <p class="mb-2">Harcod sikeresen feltöltésre került! Moderátoraink hamarosan elbírálják, és kikerül a többi harc közé</p>
                    <a href="/"><button class="mt-4 rounded bg-[#ff6004] shadow-md text-white text-center p-4 hover:shadow-sm hover:bg-[#df5200] w-full">Vissza a főoldalra</button></a>
                    </div>
            </div>
        </MainLayout>
    );
}