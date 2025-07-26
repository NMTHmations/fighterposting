import MainLayout from "../components/MainLayout";

export default function Main() {
    return (
        <MainLayout>
                <div class="flex flex-col flex-grow rounded-lg shadow-lg bg-white p-6 md:w-[60%] w-[90%] mt-6 mb-6">
                    <h2 class="text-2xl font-bold mb-4 text-center">Mi ez?</h2>
                    <p class="text-gray-700">
                        Ez az oldal egy speciális gyűjtő oldala azoknak a kommentek, posztoknak és egyéb tartalmaknak, amelyeket a Harcosok Klubja harcosai 
                        vagy a Digitális Polgári Körök polgárai osztottak meg a nagyvilággal, sokszor vicces, 
                        néhányszor arcpirító módon. A projekt célja az, hogy az oldal egyfajta görbe tükröt mutasson, 
                        hogy a tevékenységük és kampány stratégiájuk inkább hasonlít egy elbaszott South Park epizódra, 
                        mint egy normális kampányra. Az oldal nem politikai célú, hanem szórakoztató jellegű, és semmilyen 
                        politikai pártot vagy mozgalmat nem támogat vagy ellenz.
                    </p>
                    <h2 class="text-2xl font-bold mb-4 text-left ml-3 mt-4">Hogyan szerkesztheted ezt az oldalt?</h2>
                    <p class="text-gray-700">
                        Ahhoz hogy tartalmat adj hozzá az oldalhoz, először meg kell látogatnod ezt az oldalt, és ki kell töltened:<br />
                        Ezt követően a tartalom moderálásra kerül, és ha megfelel a követelményeknek, akkor felkerül az oldalra.
                    </p>
                    </div>
        </MainLayout>
    );
}