import { Spinner } from "flowbite-react";

export default function LoadingCard(props) {

    return (
        <div className="card w-full h-80">
            <div className="flex justify-center items-center h-full">
                <Spinner size="xl"/>
            </div>
        </div>
    );
}
