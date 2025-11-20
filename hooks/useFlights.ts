import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Flight } from '@/types/flight';

const PAGE_SIZE = 10;

interface UseFlightsResult {
    flights: Flight[];
    count: number;
    isLoading: boolean;
    error: unknown;
    totalPages: number;
}

export function useFlights(currentPage: number, searchQuery: string): UseFlightsResult {
    const { data, isLoading, error } = useQuery({
        queryKey: ['flights', currentPage, searchQuery],
        queryFn: async () => {
            const from = (currentPage - 1) * PAGE_SIZE;
            const to = from + PAGE_SIZE - 1;

            let queryBuilder = supabase
                .from('flights')
                .select('*', { count: 'exact' })
                .order('created_at', { ascending: false })
                .range(from, to);

            if (searchQuery) {
                queryBuilder = queryBuilder.ilike('flight_number', `%${searchQuery}%`);
            }

            const { data, error, count } = await queryBuilder;

            if (error) throw error;
            return { flights: data as Flight[], count };
        },
    });

    const flights = data?.flights || [];
    const count = data?.count || 0;
    const totalPages = Math.ceil(count / PAGE_SIZE) || 1;

    return { flights, count, isLoading, error, totalPages };
}
