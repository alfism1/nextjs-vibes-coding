import FlightSearch from '@/components/FlightSearch';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            SkyTracker
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Track your flight status instantly.
          </p>
        </div>
        <FlightSearch />
      </div>
    </main>
  );
}
