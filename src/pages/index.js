import {useChat} from "@/custom_hooks/fetch_chat";
import {useEffect, useState} from "react";
import Image from "next/image";
import {Button, Input} from "@nextui-org/react";
import axios from "axios";

export default function Home() {
    const {data, isLoading, error} = useChat();
    console.log(data);
    return (
        <main className={`flex min-h-screen min-w-screen flex-col items-center justify-between p-24 bg-gradient-to-b from-blue-500 via-blue-400 to-blue-300`}>
            <h1 className={`text-6xl font-bold text-center text-white`}>Chat, reconocimiento de voz</h1>
            <div className="flex flex-row justify-around items-center content-center w-full">
                <div className={`flex flex-col justify-center items-center gap-4 mt-4`}>
                    {isLoading ? (
                        <div className={`bg-yellow-200 p-4 shadow-md`}>Cargando...</div>
                    ) : error ? (
                        <div className={`bg-red-500 p-4 text-white`}>Error</div>
                    ) : (
                        data.map((message, index) => {
                            return <Message message={message} key={index} />;
                        })
                    )}
                </div>
                <div className="flex flex-col justify-center content-between gap-4 mt-4">
                    <SignalBox message={data[0]}/>
                    <form onSubmit={(event)=>{
                        event.preventDefault();
                        axios.post('/api/comment', {text: event.target.text.value})
                        event.target.text.value = '';
                    }}>
                        <Input placeholder="Escribe algo" type="text" name="text" />
                        <Button color={"secondary"} type="submit">Enviar</Button>
                    </form>
                </div>

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
            <p className="text-xl">{message.text}</p>
            <small className="text-gray-500">{timeAgo}</small>
        </div>
    );
}

function SignalBox({message}){
    const letters2Image = {
        'a': '/a.jpg',
        'b': '/b.jpg',
        'c': '/c.jpg',
        'd': '/d.jpg',
        'e': '/e.jpg',
        'f': '/f.jpg',
        'g': '/g.jpg',
        'h': '/h.jpg',
        'i': '/i.jpg',
        'j': '/j.jpg',
        'k': '/k.jpg',
        'l': '/l.jpg',
        'm': '/m.jpg',
        'n': '/n.jpg',
        'ñ': '/enie.jpg',
        'o': '/o.jpg',
        'p': '/p.jpg',
        'q': '/q.jpg',
        'r': '/r.jpg',
        's': '/s.jpg',
        't': '/t.jpg',
        'u': '/u.jpg',
        'v': '/v.jpg',
        'w': '/w.jpg',
        'x': '/x.jpg',
        'y': '/y.jpg',
        'z': '/z.jpg',
        ' ': '/space.png',
    }
    const [currentLetter, setCurrentLetter] = useState(' ');
    console.log(currentLetter)

    useEffect(() => {
        const text = removeAccents(message?.text.toLowerCase() || ' ');
        const totalLetters = text.length;
        for (let i = 0; i < totalLetters; i++) {
            setTimeout(() => {
                setCurrentLetter(text[i]);
            }, 1000 * i);
        }
    }, [message])

    return(
        <div className="h-60 w-60">
            <Image className="rounded-lg" width={500} height={500} src={"/letters"+letters2Image[currentLetter]} alt={"Current letter"} />
        </div>
    )
}

function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
