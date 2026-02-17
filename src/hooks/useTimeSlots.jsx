import { useQuery } from "@tanstack/react-query"
import { timeSlots } from "../lib/api"

const useTimeSlots = () => {

    const { data, isLoading, error } = useQuery({
        queryKey: ["timeSlots"],
        queryFn: () => timeSlots(),
    })

    return { data, isLoading, error }
}

export default useTimeSlots