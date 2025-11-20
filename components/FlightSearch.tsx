'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Flight {
    flightNumber: string;
    startTime: string;
    endTime: string;
    timeZone: string;
    startLocation: string;
    endLocation: string;
}

export default function FlightSearch() {
    const [flightNumber, setFlightNumber] = useState('');
    const [flights, setFlights] = useState<Flight[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!flightNumber.trim()) return;

        setLoading(true);
        setError('');
        setFlights([]);
        setHasSearched(true);

        try {
            const response = await fetch(`/api/flights?flightNumber=${encodeURIComponent(flightNumber)}`);
            if (!response.ok) {
                throw new Error('Failed to fetch flights');
            }
            const data = await response.json();
            setFlights(data);
        } catch (err) {
            setError('An error occurred while fetching flight data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md space-y-6 transition-colors duration-300">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">Flight Lookup</h2>

            <form onSubmit={handleSearch} className="space-y-4">
                <div>
                    <label htmlFor="flightNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Flight Number
                    </label>
                    <input
                        type="text"
                        id="flightNumber"
                        value={flightNumber}
                        onChange={(e) => setFlightNumber(e.target.value)}
                        placeholder="e.g., AA123"
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500"
                    />
                </div>
                <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 transition-colors"
                >
                    {loading ? 'Searching...' : 'Search Flight'}
                </motion.button>
            </form>

            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md text-sm">
                    {error}
                </div>
            )}

            {hasSearched && !loading && flights.length === 0 && !error && (
                <div className="text-center text-gray-500 dark:text-gray-400">
                    No flights found for "{flightNumber}".
                </div>
            )}

            <AnimatePresence>
                {flights.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-4"
                    >
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Results</h3>
                        {flights.map((flight, index) => (
                            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{flight.flightNumber}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{flight.timeZone}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">Departure</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">{flight.startLocation}</p>
                                        <p className="text-gray-700 dark:text-gray-300">{new Date(flight.startTime).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">Arrival</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">{flight.endLocation}</p>
                                        <p className="text-gray-700 dark:text-gray-300">{new Date(flight.endTime).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
