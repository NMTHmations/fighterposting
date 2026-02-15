import MessageBubble from "../components/MessageBubble";
import MessageHeader from "../components/MessageHeader";
import MessageDivision from "../components/MessageDivision";
import { createEffect, createSignal, For, onMount, Show } from "solid-js";

export default function Messages() {
    const [messages, setMessages] = createSignal([]);
    
    const fetchDates = async () => {
        const response = await fetch(import.meta.env.VITE_API_URL + `fighter/sms/`);
        if (!response.ok) {
            console.error("Failed to fetch message dates");
            return;
        }
        const data = await response.json();
        setMessages(data);

    };

    onMount(() => {
        fetchDates();
    });


    return (
        <MessageHeader>
            <div class="flex flex-col flex-grow w-full max-w-screen p-4">
                <Show when={messages().length > 0} fallback={<p>Loading...</p>}>
                    <For each={messages()}>
                        {(message, index) => {
                            const prev = messages()[index() - 1];

                            const showDivision = index() === 0 || prev?.date !== message.date;

                            const formattedDate = new Date(message.date).toLocaleDateString("hu-HU", {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                            });
                            return (
                                <>
                                {showDivision && <MessageDivision time={formattedDate} />}
                                <MessageBubble message={message.message} />
                                </>
                            );
                        }}
                    </For>
                </Show>
                </div>
        </MessageHeader>
    );
}