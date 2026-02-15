interface MessageInterfaceProps {
    time: string;
}

function MessageDivision(props: MessageInterfaceProps) {
    return (
        <>
        <div class="flex flex-row items-center justify-center min-h-15">
    <div class="bg-blue-600 w-full h-1"></div>
    <div class="w-full text-center">
    <p class="text-black">{props.time}</p>
    </div>
    <div class="bg-blue-600 w-full h-1"></div>
    </div>
    </>
    );
}

export default MessageDivision;