import useSWR from "swr";
import axios from "axios";

export function useChat() {
    const fetcher = url => axios.get(url).then(res => res.data);
    const {data, error, isLoading} = useSWR("api/comment", fetcher, { refreshInterval: 1000 });
    const return_data = data ? data.data.map((data) => {
        const date = new Date(data.date);
        return {
            id: data.id,
            text: data.text,
            date: date.toString()
        }
    }) : [];
    return {
        data: return_data,
        isLoading: isLoading,
        error: error
    }
}