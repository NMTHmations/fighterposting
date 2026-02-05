import { createEffect } from "solid-js";
import AdminMain from "../../components/AdminMain";
import Plate from "../../components/Plate";
import BlogManager from "./services/BlogManager";
import { useNavigate } from "@solidjs/router";

export default function Blogposts() {

    const navigate = useNavigate();

    createEffect(async () => {
                const res = await fetch(import.meta.env.VITE_TOKEN_REFRESH_URL, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({})
                });
                if (res.status !== 200) {
                    navigate("/admin");
                }
            });

    return (
        <AdminMain is_logged_in={false}>
            <div class="z-5 flex flex-col items-center justify-center flex-grow">
                <Plate type="blogpost_admin">
                    <BlogManager></BlogManager>
                </Plate>
            </div>
        </AdminMain>
    );
}