export default function SearchBar() {
  return (
    <section className="py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-md md:p-6">
          <h2 className="text-xl font-bold text-gray-900">Search Your Cab</h2>
          <p className="mt-1 text-sm text-gray-600">Enter route details and travel date to check available cabs.</p>
          <form className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
            <input className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-600" placeholder="Pickup City" />
            <input className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-600" placeholder="Drop City" />
            <input className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-600" type="date" />
            <button
              type="button"
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 ease-in-out hover:scale-105 hover:bg-blue-700"
            >
              Search Cabs
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
