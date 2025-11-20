import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const flightNumber = searchParams.get('flightNumber');

  if (!flightNumber) {
    return NextResponse.json({ error: 'Flight number is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('flights')
    .select('*')
    .ilike('flight_number', flightNumber);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Map database fields to frontend expected format if necessary (or update frontend types)
  // The frontend expects: flightNumber, startTime, endTime, timeZone, startLocation, endLocation
  // The DB has: flight_number, start_time, end_time, time_zone, start_location, end_location

  const formattedFlights = data.map((flight) => ({
    flightNumber: flight.flight_number,
    startTime: flight.start_time,
    endTime: flight.end_time,
    timeZone: flight.time_zone,
    startLocation: flight.start_location,
    endLocation: flight.end_location,
  }));

  return NextResponse.json(formattedFlights);
}
