import { useNavigate, useParams } from "@solidjs/router";
import { createResource, createSignal, For, Show } from "solid-js";
import MainLayout from "../components/MainLayout";
import image from "../img/orange.webp";
import colorless from "../img/orange.png";
import halfOrange from "../img/half_orange.png";

export default function Main() {

    const params = useParams();
    
    const navigate = useNavigate();

    const fetchReviews = async () => {
        const response = await fetch(import.meta.env.VITE_API_URL + `/posts/${params.slug}/`);
        if (!response.ok) navigate("/404");
        return await response.json();
    };

    const [data, {refetch}] = createResource(fetchReviews);

    const AddRating = async (id, star) => {
        if (localStorage.getItem(id)) {
            alert("You have already rated this post.");
            return;
        }
        const formData = new FormData();
        formData.append("id", id);
        formData.append("star", star);
        const response = await fetch(import.meta.env.VITE_ADD_RATING_URL, {
            method: "PATCH",
            body: formData
        });
        if (response.ok) {
            localStorage.setItem(id, star);
            alert("Orange added to the post successfully");
            refetch();
        } else {
            alert("Failed to add an orange to the post");
        }
    };

    const handleMouseOver = (e) => {
        const starId = e.target.id;
        const stars = document.querySelectorAll("img[id]");
        stars.forEach(star => {
            const img = star as HTMLImageElement;
            if (parseInt(img.id) <= parseInt(starId)) {
                img.src = image;
            } else {
                img.src = colorless;
            }
        });
    }

    const handleMouseOut = () => {
        const stars = document.querySelectorAll("img[id]");
        stars.forEach(star => {
            const img = star as HTMLImageElement;
            if (parseInt(img.id) <= data().starAvg)
                img.src = image;
            else img.src = colorless;
        });
    };

    return (
        <MainLayout>
            <div class="flex flex-col items-center justify-center flex-grow">
                <Show when={data()} fallback={
                                                <>
                                                <div class="flex flex-col rounded-lg shadow-lg bg-white p-6 w-[90%] min-w-[300px] md:w-[60%] md:min-w-[400px] mt-4 mb-6">
                                                <p>Loading...</p>
                                                </div>
                                                </>
                                                }>
                                                    <div class="flex flex-col rounded-lg shadow-lg bg-white p-6 w-[90%] min-w-[300px] md:w-[60%] md:min-w-[400px] mt-4 mb-4">
                                                        <h2 class="text-2xl font-bold mb-4 text-center">{data().title}</h2>
                                                        <img src={`http://localhost:8000${data().image_source}`} alt="Harcos" class="rounded-lg shadow-lg w-full h-auto mb-4" />
                                                        <p class="mb-4 text-lg font-semibold">Értékelés:</p>
                                                        <div class="flex flex-row justify-center items-center gap-2 mb-4">
                                                            <For each={[1, 2, 3, 4, 5]}>
                                                                {(star) =>
                                                                    Math.round(data().starAvg * 2) / 2 >= star ? (
                                                                        <img src={image} alt="Orange" class="w-[10%] cursor-pointer" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} onClick={() => AddRating(data().id, star)} id={star.toString()} />
                                                                    ) : Math.round(data().starAvg * 2) / 2 == (star - 0.5) && Math.round(data().starAvg * 2) / 2 < star ?
                                                                    (<img src={halfOrange} alt="Orange" class="w-[10%] cursor-pointer" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} onClick={() => AddRating(data().id, star)} id={star.toString()} />)
                                                                    :  (<img src={colorless} alt="Orange" class="w-[10%] cursor-pointer" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} onClick={() => AddRating(data().id, star)} id={star.toString()} />)
                                                                }
                                                            </For>
                                                            <p class="text-lg font-semibold">{data().starAvg.toFixed(1)} / 5</p>
                                                        </div>
                                                    </div>
                                                </Show>
            </div>
        </MainLayout>
    );
}