import MessageBubble from "../components/MessageBubble";
import MessageHeader from "../components/MessageHeader";
import MessageDivision from "../components/MessageDivision";
import { createEffect, createSignal, For, onMount, Show } from "solid-js";
import { PropagandistProperties } from "../../../interfaces/propagandistInterface";

interface MessageListItem {
    propagandist: PropagandistProperties;
    lastMessage: string;
}

export default function Messages() {
    const [messages, setMessages] = createSignal([]);
    const [actualMessages, setActualMessages] = createSignal([]);
    const [propagandists, setPropagandists] = createSignal([]);
    const [selectedPropagandist, setSelectedPropagandist] = createSignal<PropagandistProperties | null>(null);
    const [messageList, setMessageList] = createSignal<MessageListItem[]>([]);

    let chatRef: HTMLDivElement | undefined; // ref to the scroll container
    
    const fetchDates = async () => {
        const response = await fetch(import.meta.env.VITE_API_URL + `fighter/sms/`);
        if (!response.ok) {
            console.error("Failed to fetch message dates");
            return;
        }
        const data = await response.json();
        setMessages(data);
        retrieveMessageList();
    };

    const fetchPropagandists = async () => {
        fetch(import.meta.env.VITE_API_URL + `sender/`)
        .then(async (response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch propagandists");
            }
            return await response.json();
        })
        .then((data) => {
            setPropagandists(JSON.parse(data));
        }).catch((error) => {
            console.error("Error fetching propagandists:", error);
        });
    };

    onMount(() => {
        fetchPropagandists()
        fetchDates()
    });

    // Scroll to bottom whenever messages change
  createEffect(() => {
    if (chatRef && messages().length > 0) {
      // Scroll to bottom after next DOM update
      requestAnimationFrame(() => {
        chatRef!.scrollTop = chatRef!.scrollHeight;
      });
    }
  });

  const retrieveMessageList = async () => {
    console.log("Propagandists:", propagandists());
    console.log("Messages:", messages());
    propagandists().forEach((propagandist) => {
        const lastMessage = messages().findLast((message) => Number(message.senderId) === Number(propagandist.id));
        if (lastMessage) {
            setMessageList([...messageList(), { propagandist: propagandist, lastMessage: lastMessage.message }]);
        }
    });
    console.log("Message list:", messageList());
  }

  const handleSelectPropagandist = (propagandist: PropagandistProperties) => {
    setSelectedPropagandist(propagandist);
    const filteredMessages = messages().filter((message) => Number(message.senderId) == Number(propagandist.id));
    setActualMessages(filteredMessages);
  };

    return (
        <MessageHeader selectedPropagandist={selectedPropagandist()} setSelectedPropagandist={setSelectedPropagandist}>
            { selectedPropagandist() ?
            <div ref={chatRef} class="flex flex-col flex-grow w-full max-w-screen p-4 overflow-y-auto h-[500px]">
                <Show when={actualMessages().length > 0} fallback={<p>Loading...</p>}>
                    <For each={actualMessages()}>
                        {(message, index) => {
                            const prev = actualMessages()[index() - 1];

                            const showDivision = index() === 0 || prev?.date !== message.date;

                            const formattedDate = new Date(message.date).toLocaleDateString("hu-HU", {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                            });
                            return (
                                <>
                                {showDivision && <MessageDivision time={formattedDate} />}
                                <MessageBubble message={message.message} selectedPropagandist={selectedPropagandist()} />
                                </>
                            );
                        }}
                    </For>
                </Show>
                </div>
                :
                <div class="flex flex-col flex-grow w-full max-w-screen p-4 overflow-y-auto h-[500px]">
                    <Show when={messageList().length > 0} fallback={<p>Loading...</p>}>
                        <For each={messageList()}>
                            {(item) => (
                                <div class="flex flex-col mb-4 cursor-pointer border-b pb-2 border-gray-300" onClick={() => handleSelectPropagandist(item.propagandist)}>
                                    <div class="flex flex-row items-center gap-4">
                                        <img src={`${import.meta.env.VITE_API_URL}${item.propagandist.fileUrl}`} alt="Propagandista" class="w-12 h-12 rounded-full" />
                                        <div class="flex flex-col">
                                            <p class="font-bold">{item.propagandist.name}</p>
                                            <p class="text-gray-600">{item.lastMessage}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </For>
                    </Show>
                    <div class="fixed bottom-0 left-0 right-0 z-50 bg-gray-100 p-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 justify-items-center items-stretch">
                            {
                                window.outerWidth >= 450 ?
                                <>
                                    <a href="/" class="w-full"><button class="rounded bg-[#ff6004] shadow-md text-white text-center p-4 h-full hover:shadow-sm hover:bg-[#df5200] w-full">Összes poszt megtekintése</button></a>
                                    <a href="/old_index" class="w-full"><button class="rounded bg-[#ff6004] shadow-md text-white text-center p-4 h-full hover:shadow-sm hover:bg-[#df5200] w-full mr-5">Tovább a FighterPostingra</button></a>
                                </>
                                :
                                <a href="/old_index" class="w-full"><button class="rounded bg-[#ff6004] shadow-md text-white text-center p-4 h-full hover:shadow-sm hover:bg-[#df5200] w-full mr-5">Tovább a FighterPostingra</button></a>
                            }
                        </div>
                    </div>
                </div>
            }
        </MessageHeader>
    );
}