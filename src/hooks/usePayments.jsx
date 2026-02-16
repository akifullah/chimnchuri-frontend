import { paymentSettings } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

const usePayments = () => {

    const { data, isLoading, error } = useQuery({
        queryKey: ["payments"],
        queryFn: () => paymentSettings(),
    });

    return {
        "data": data?.data,
        isLoading,
        error
    }
}

export default usePayments