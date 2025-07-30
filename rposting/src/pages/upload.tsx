import MainLayout from "../components/MainLayout";

export default function Main() {
    return (
        <MainLayout>
            <div class="flex flex-col items-center justify-center flex-grow">
                <div class="flex flex-col rounded-lg shadow-lg bg-white p-6 w-[90%] min-w-[300px] md:w-[60%] md:min-w-[400px] mt-4 mb-4">
                    <h2 class="text-2xl font-bold mb-4 text-center">Harcos harcának feltöltése</h2>
                    <input type="file" id="file-upload" class="hidden" />
                    <label for="file-upload" class="mb-4 rounded bg-[#ff6004] shadow-md text-white text-center p-4 hover:shadow-sm hover:bg-[#df5200]">Feltöltés</label>
                    </div>
            </div>
        </MainLayout>
    );
}