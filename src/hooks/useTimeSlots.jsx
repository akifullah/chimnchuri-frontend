import { useQuery } from "@tanstack/react-query"
import { timeSlots } from "../lib/api"

const useTimeSlots = (orderType) => {

    const { data, isLoading, error } = useQuery({
        queryKey: ["timeSlots", orderType],
        queryFn: () => timeSlots(orderType),
    })

    return { data, isLoading, error }
}

export default useTimeSlots