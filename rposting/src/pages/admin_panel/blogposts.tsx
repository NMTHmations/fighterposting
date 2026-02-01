import AdminMain from "../../components/AdminMain";
import Plate from "../../components/Plate";
import BlogManager from "./services/BlogManager";

export default function Blogposts() {
    return (
        <AdminMain is_logged_in={false}>
            <div class="z-5 flex flex-col items-center justify-center flex-grow">
                <Plate type="fight">
                    <BlogManager></BlogManager>
                </Plate>
            </div>
        </AdminMain>
    );
}