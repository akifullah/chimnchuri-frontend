import { fetchOffer } from "@/lib/api";
import { setOffer } from "@/store/features/offerSlice";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export const useOffer = () => {
    const dispatch = useDispatch();
    const { data, isLoading, error } = useQuery({
        queryKey: ["offer"],
        queryFn: fetchOffer,
        staleTime: 1000 * 60 * 5,
    });


    useEffect(() => {
        if (data?.data) {
            dispatch(setOffer(data?.data));
        }
    }, [data]);

    return { data, isLoading, error };
};