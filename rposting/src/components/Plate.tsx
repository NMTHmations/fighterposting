import { JSX } from "solid-js";

interface plateProps {
    type?: string;
    children: JSX.Element;
}

export default function Plate(props: plateProps) {
    return (
        props.type === "fight" ?
        <div class="flex flex-col md:rounded-lg shadow-lg bg-white w-[100%] min-w-[300px] md:w-[60%] md:p-4 md:min-w-[400px] mb-6">
            {props.children}
        </div>
        :
        props.type === "recommended" ?
        <div class="flex flex-col md:rounded-lg shadow-lg bg-white pt-4 md:p-6 w-[100%] min-w-[300px] md:w-[60%] md:min-w-[400px] mt-4 mb-4">
            {props.children}
        </div>
        :
        props.type === "welcome" ?
        <div class="flex flex-col md:rounded-lg shadow-lg bg-white p-6 w-[100%] min-w-[300px] md:w-[60%] md:min-w-[400px] mt-4 mb-4">
            {props.children}
        </div>
        :
        props.type === "small" ?
        <div class="flex flex-col rounded-lg shadow-lg bg-white p-6 w-[90%] min-w-[300px] md:w-[60%] md:min-w-[400px] mt-4 mb-4">
            {props.children}
        </div>
        :
        props.type === "post" ?
        <div class="flex flex-col md:rounded-lg shadow-lg bg-white md:p-6 w-[100%] min-w-[300px] md:w-[60%] md:min-w-[400px] mt-4 mb-4">
            {props.children}
        </div>
        :
        props.type === "admin" ?
        <div class="flex flex-col rounded-lg shadow-lg bg-white w-[90%] md:w-full md:min-w-[600px] mt-4 mb-4">
            {props.children}
        </div>
        :
        props.type === "blogpost_admin" ?
        <div class="flex flex-col md:rounded-lg shadow-lg bg-white w-[100%] min-w-[800px] md:w-[60%] md:p-4 md:min-w-[800px] mb-6">
            {props.children}
        </div>
        :
        props.type === "blog" ?
        <div class="flex flex-col md:rounded-lg shadow-lg bg-white sm:w-screen w-[100%] md:w-[70%] p-4 min-w-screen md:min-w-[600px] lg:min-w-[800px] xl:min-w-[800px] sm:min-w-[300px] mt-3 mb-3">
            {props.children}
        </div>
        :
        <></>
    );
}