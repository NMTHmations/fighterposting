import MainLayout from "../components/MainLayout";
import { ChevronDown} from "lucide-solid";

export default function Main() {
    return (
        <MainLayout>
            <div class="flex flex-col items-center justify-center flex-grow">
                <div class="flex flex-col rounded-lg shadow-lg bg-white p-6 md:w-[60%] w-[90%] mt-4 mb-4">
                    <h2 class="text-2xl font-bold mb-4 text-center">Mi ez?</h2>
                    <p class="text-gray-700">
                        Ez az oldal egy speciális gyűjtő oldala azoknak a kommenteknek, posztoknak és egyéb tartalmaknak, amelyeket a Harcosok Klubja harcosai 
                        vagy a Digitális Polgári Körök polgárai osztottak meg a nagyvilággal, sokszor vicces, 
                        néhányszor arcpirító módon. A projekt célja az, hogy az oldal egyfajta görbe tükröt mutasson, 
                        hogy a tevékenységük és kampány stratégiájuk inkább hasonlít egy elbaszott South Park epizódra, 
                        mint egy normális kampányra. Az oldal nem politikai célú, hanem szórakoztató jellegű, és semmilyen 
                        politikai pártot vagy mozgalmat nem támogat vagy ellenz.
                    </p>
                    <h2 class="text-2xl font-bold mb-4 text-left ml-3 mt-4">Hogyan szerkesztheted ezt az oldalt?</h2>
                    <p class="text-gray-700">
                        Ahhoz hogy tartalmat adj hozzá az oldalhoz, először meg kell látogatnod ezt az oldalt, és ki kell töltened:</p>
                        <div class="flex flex-col items-center mt-2 mb-2 w-full">
                            <div class="gap-4"></div>
                            <div>
                            <a href="/upload" class="w-full"><button class="mt-4 rounded bg-[#ff6004] shadow-md text-white text-center p-4 hover:shadow-sm hover:bg-[#df5200] max-w-[550px] mt-4 mb-4">Harc feltöltése</button></a>
                            </div>
                            <div class="gap-4"></div>
                        </div>
                        <p class="text-gray-700">
                        Ezt követően a tartalom moderálásra kerül, és ha megfelel a követelményeknek, akkor felkerül az oldalra.
                    </p>
                    <h2 class="text-2xl font-bold mb-4 text-left ml-3 mt-4">Fejlesztői roadmap</h2>
                    <p class="text-gray-700">
                        Az elkövetkezendő pár hónapban a választásokig az alábbi funkciókat tervezem implementálni még (tömött sárga dobozok jelzik a leimplementált funkciókat):</p>
                    <div class="flex flex-col items-center mt-2 mb-2 w-full">
                            <div class="gap-4"></div>
                            <div>
                            <div class="rounded-2xl max-w-[500px] bg-[#ff6004] text-white mt-4 mb-4 p-4"><p>Kezdetleges weboldal, narancsértékelő, képfeltöltés</p></div>
                            </div>
                            <div class="gap-4"></div>
                        </div>
                    <div class="flex flex-col items-center mt-2 mb-2 w-full">
                        <ChevronDown/>
                        </div>
                        <div class="flex flex-col items-center mt-2 mb-2 w-full">
                            <div class="gap-4"></div>
                            <div>
                            <div class="rounded-2xl max-w-[500px] border-4 border-orange-500 mt-4 mb-4 p-4"><p>Fejlesztői blog (hogy az ilyen förtelmes stílus elemeket mellőzzem), sötét mód, kategóriák, keresőoldal</p></div>
                            </div>
                            <div class="gap-4"></div>
                        </div>
                        <div class="flex flex-col items-center mt-2 mb-2 w-full">
                        <ChevronDown/>
                        </div>
                        <div class="flex flex-col items-center mt-2 mb-2 w-full">
                            <div class="gap-4"></div>
                            <div>
                            <div class="rounded-2xl max-w-[500px] border-4 border-orange-500 mt-4 mb-4 p-4"><p>Képek megosztása más közösségi oldalakra, Halloween-i rohadós narancs</p></div>
                            </div>
                            <div class="gap-4"></div>
                        </div>
                        <div class="flex flex-col items-center mt-2 mb-2 w-full">
                        <ChevronDown/>
                        </div>
                        <div class="flex flex-col items-center mt-2 mb-2 w-full">
                            <div class="gap-4"></div>
                            <div>
                            <div class="rounded-2xl max-w-[500px] border-4 border-orange-500 mt-4 mb-4 p-4"><p>Videók feltöltése (legjobb esetben, még nem biztos ez)</p></div>
                            </div>
                            <div class="gap-4"></div>
                        </div>
                    </div>
            </div>
        </MainLayout>
    );
}