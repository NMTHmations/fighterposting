interface MessageBubbleProps {
    message: string;
    selectedPropagandist: PropagandistProperties | null;
}

function MessageBubble(props: MessageBubbleProps) {

    const formattedMessage = props.message.replaceAll("<a href=", "<a class=\"text-white-500 underline hover:text-blue-800\" target=\"_blank\" href=");

    return (
<div class="flex items-end gap-3">
  <img 
    src={`${import.meta.env.VITE_API_URL}${props.selectedPropagandist?.fileUrl}`} 
    alt="profile"
    class="w-10 h-10 rounded-full object-cover"
  />

  <div class="relative max-w-xs md:max-w-md min-w-0">
    <div class="bg-[#ff6004] text-white px-8 py-2 rounded-2xl shadow mb-2 break-words">
        <p class="text-sm" innerHTML={formattedMessage}></p>
    </div>

    <div class="absolute -left-1 bottom-4 w-5 h-5 bg-[#ff6004] rotate-45"></div>
  </div>
</div>
    );
}

export default MessageBubble;