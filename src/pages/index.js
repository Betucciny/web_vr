import {useChat} from "@/custom_hooks/fetch_chat";
import {useEffect, useState} from "react";

export default function Home() {
    const {data, isLoading, error} = useChat();

    console.log(data);
    return (
        <main className={`flex min-h-screen flex-col items-center justify-between p-24`}>
            <h1 className={`text-6xl font-bold text-center`}>Bienvenido a la página de Chat</h1>
            <div className={`flex flex-col justify-center items-center gap-4`}>
                {isLoading ? <div>Cargando...</div> : error ? <div>Error</div> :
                    data.map((message, index) => {
                        return <Message message={message} key={index}/>
                    })
                }
            </div>
        </main>
    )
}

function Message({ message }) {
    const [timeAgo, setTimeAgo] = useState('');

    useEffect(() => {
        // Function to update timeAgo
        const updateAgoString = () => {
            const sentDate = new Date(message.date); // Convert UTC date string to a Date object
            const currentDate = new Date();
            const timeDifference = currentDate - sentDate;

            // Define time units
            const seconds = Math.floor(timeDifference / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);

            let agoString;

            if (days > 0) {
                agoString = `${days} day${days > 1 ? 's' : ''} ago`;
            } else if (hours > 0) {
                agoString = `${hours} hour${hours > 1 ? 's' : ''} ago`;
            } else if (minutes > 0) {
                agoString = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
            } else {
                agoString = `${seconds} second${seconds > 1 ? 's' : ''} ago`;
            }

            setTimeAgo(agoString);
        };

        // Initial update
        updateAgoString();

        // Set up an interval to update every minute
        const intervalId = setInterval(updateAgoString, 1000);

        // Cleanup the interval on unmount
        return () => {
            clearInterval(intervalId);
        };
    }, [message.date]);

    return (
        <div className="bg-gray-100 p-4 m-2 rounded-lg shadow-md">
            <p>
            </p>
            <p className="text-lg">{message.text}</p>
            <small className="text-gray-500">{timeAgo}</small>
        </div>
    );
}
