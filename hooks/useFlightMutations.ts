import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useFlightMutations() {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('flights').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['flights'] });
        },
        onError: (error) => {
            console.error('Error deleting flight:', error);
            alert('Failed to delete flight');
        },
    });

    return {
        deleteFlight: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending,
    };
}
