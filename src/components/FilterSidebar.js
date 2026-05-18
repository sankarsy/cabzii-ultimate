const priceOptions = [
  { label: "Any Price", value: "" },
  { label: "Up to ₹1500", value: "1500" },
  { label: "Up to ₹2500", value: "2500" },
  { label: "Up to ₹4000", value: "4000" },
  { label: "Up to ₹6000", value: "6000" }
];

const vehicleOptions = ["Sedan", "SUV", "Van", "Bus"];
const amenityOptions = ["AC", "GPS", "Music", "FastTag"];

export default function FilterSidebar({ filters, setFilters, mobileOpen, setMobileOpen, inline = true }) {
  const updateAmenity = (amenity) => {
    const exists = filters.amenities.includes(amenity);
    const amenities = exists ? filters.amenities.filter((item) => item !== amenity) : [...filters.amenities, amenity];
    setFilters((prev) => ({ ...prev, amenities }));
  };

  const buttonBase =
    "rounded-lg border px-3 py-2 text-sm font-semibold transition-all duration-300 ease-in-out hover:scale-105";

  const panel = (
    <div className="h-full rounded-xl border border-gray-100 bg-white p-4 shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Filters</h3>
          <button
            type="button"
            onClick={() => setFilters({ priceRange: "", vehicleType: "", amenities: [] })}
            className="text-sm font-semibold text-orange-500 transition-all duration-300 ease-in-out hover:text-orange-600"
          >
            Reset
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <p className="mb-2 text-sm font-semibold text-gray-700">Price Range</p>
            <div className="flex flex-wrap gap-2">
              {priceOptions.map((option) => {
                const active = filters.priceRange === option.value;
                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => setFilters((prev) => ({ ...prev, priceRange: option.value }))}
                    className={`${buttonBase} ${
                      active ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-gray-700">Vehicle Type</p>
            <div className="flex flex-wrap gap-2">
              {vehicleOptions.map((type) => {
                const active = filters.vehicleType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFilters((prev) => ({ ...prev, vehicleType: active ? "" : type }))}
                    className={`${buttonBase} ${
                      active ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-gray-700">Amenities</p>
            <div className="flex flex-wrap gap-2">
              {amenityOptions.map((amenity) => {
                const active = filters.amenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => updateAmenity(amenity)}
                    className={`${buttonBase} ${
                      active ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {amenity}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
  );

  return (
    <>
      {inline ? panel : null}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 p-4 md:hidden">
          <div className="max-h-[85vh] overflow-y-auto rounded-xl bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Filter Cabs</h3>
              <button
                type="button"
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-700"
                onClick={() => setMobileOpen(false)}
              >
                Close
              </button>
            </div>
            {panel}
          </div>
        </div>
      )}
    </>
  );
}
