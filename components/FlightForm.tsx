'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Flight } from '@/types/flight';

interface FlightFormProps {
    flight?: Flight | null;
    onSuccess: () => void;
}

export default function FlightForm({ flight, onSuccess }: FlightFormProps) {
    const [formData, setFormData] = useState<Flight>({
        id: '',
        flight_number: '',
        start_time: '',
        end_time: '',
        time_zone: '',
        start_location: '',
        end_location: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (flight) {
            setFormData({
                ...flight,
                start_time: new Date(flight.start_time).toISOString().slice(0, 16),
                end_time: new Date(flight.end_time).toISOString().slice(0, 16),
            });
        }
    }, [flight]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                ...formData,
                start_time: new Date(formData.start_time).toISOString(),
                end_time: new Date(formData.end_time).toISOString(),
            };
            // Remove id from payload if it's empty or if we are inserting
            if (!flight?.id) {
                delete (payload as any).id;
            }

            if (flight?.id) {
                const { error } = await supabase
                    .from('flights')
                    .update(payload)
                    .eq('id', flight.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('flights')
                    .insert([payload]);
                if (error) throw error;
            }

            onSuccess();
        } catch (err: any) {
            console.error('Error saving flight:', err);
            setError(err.message || 'Failed to save flight');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Flight Number</label>
                    <input
                        type="text"
                        name="flight_number"
                        value={formData.flight_number}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Time Zone</label>
                    <input
                        type="text"
                        name="time_zone"
                        value={formData.time_zone}
                        onChange={handleChange}
                        required
                        placeholder="e.g. America/New_York"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Location</label>
                    <input
                        type="text"
                        name="start_location"
                        value={formData.start_location}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Location</label>
                    <input
                        type="text"
                        name="end_location"
                        value={formData.end_location}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Time</label>
                    <input
                        type="datetime-local"
                        name="start_time"
                        value={formData.start_time}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Time</label>
                    <input
                        type="datetime-local"
                        name="end_time"
                        value={formData.end_time}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <div className="flex justify-end">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors"
                >
                    {loading ? 'Saving...' : 'Save Flight'}
                </motion.button>
            </div>
        </form>
    );
}
