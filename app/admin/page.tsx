'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import FlightForm from '@/components/FlightForm';
import FlightTable from '@/components/admin/FlightTable';
import Pagination from '@/components/admin/Pagination';
import FlightSearch from '@/components/admin/FlightSearch';
import { useFlights } from '@/hooks/useFlights';
import { useFlightMutations } from '@/hooks/useFlightMutations';
import { Flight } from '@/types/flight';

export default function AdminPage() {
    const [isEditing, setIsEditing] = useState(false);
    const [currentFlight, setCurrentFlight] = useState<Flight | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSearch, setActiveSearch] = useState('');
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const queryClient = useQueryClient();
    const { flights, isLoading, totalPages } = useFlights(currentPage, activeSearch);
    const { deleteFlight } = useFlightMutations();

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        setActiveSearch(searchQuery);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this flight?')) return;
        deleteFlight(id);
    };

    const handleEdit = (flight: Flight) => {
        setCurrentFlight(flight);
        setIsEditing(true);
    };

    const handleSuccess = () => {
        setIsEditing(false);
        setCurrentFlight(null);
        queryClient.invalidateQueries({ queryKey: ['flights'] });
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };


    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8 transition-colors duration-300">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Flight Management</h1>
                    <div>
                        <button
                            onClick={() => {
                                setCurrentFlight(null);
                                setIsEditing(!isEditing);
                            }}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                        >
                            {isEditing ? 'Cancel' : 'Add Flight'}
                        </button>
                        <button
                            onClick={handleLogout}
                            className="ml-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <FlightSearch
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onSearchSubmit={handleSearchSubmit}
                />

                {isEditing && (
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md animate-fade-in-up">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                            {currentFlight ? 'Edit Flight' : 'Add New Flight'}
                        </h2>
                        <FlightForm flight={currentFlight} onSuccess={handleSuccess} />
                    </div>
                )}

                <FlightTable
                    flights={flights}
                    isLoading={isLoading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

                {!isLoading && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    );
}
