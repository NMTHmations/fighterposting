import AdminMain from "../../components/AdminMain";
import Plate from "../../components/Plate";
import SMSManager from "./services/SMSManager";

export default function SMS() {
    return (
        <AdminMain is_logged_in={false}>
            <div class="z-5 flex flex-col items-center justify-center flex-grow">
            <Plate type="fight">
                <SMSManager></SMSManager>
            </Plate>
            </div>
        </AdminMain>
    );
}

