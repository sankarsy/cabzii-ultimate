export default function Footer() {
  return (
    <footer className="mt-14 border-t border-slate-200 bg-slate-950 py-12 text-slate-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-bold text-sky-400">cabzii.in</h3>
            <p className="mt-2 text-sm text-slate-400">Premium cab and tour experiences with transparent fares and verified drivers.</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Quick Links</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li><a href="/" className="hover:text-sky-300">Home</a></li>
              <li><a href="/cabs" className="hover:text-sky-300">Cabs</a></li>
              <li><a href="/packages" className="hover:text-sky-300">Tours</a></li>
              <li><a href="/drivers" className="hover:text-sky-300">Drivers</a></li>
              <li><a href="/locations" className="hover:text-sky-300">Locations</a></li>
            </ul>
            <h4 className="mt-5 text-sm font-semibold text-white">Popular cities</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li><a href="/cab-booking/chennai" className="hover:text-sky-300">Cab booking Chennai</a></li>
              <li><a href="/acting-driver/chennai" className="hover:text-sky-300">Acting driver Chennai</a></li>
              <li><a href="/cab-booking/bengaluru" className="hover:text-sky-300">Cab booking Bengaluru</a></li>
              <li><a href="/acting-driver/mumbai" className="hover:text-sky-300">Acting driver Mumbai</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Contact Details</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li>Email: support@cabzii.com</li>
              <li>Phone: +91 99441 97416</li>
              <li>Address: maduravoyal,chennai, Tamil Nadu</li>
              <li>Mon-Sun: 24x7 Support</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Social</h4>
            <div className="mt-3 flex gap-3">
              {["FB", "IG", "X", "YT"].map((icon) => (
                <span key={icon} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-xs font-bold text-slate-300 transition hover:border-sky-400 hover:text-sky-300">
                  {icon}
                </span>
              ))}
            </div>
            <h4 className="mt-5 text-sm font-semibold text-white">Legal</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li><a href="/terms-and-conditions" className="hover:text-sky-300">Terms and Conditions</a></li>
              <li><a href="/legal-declaration" className="hover:text-sky-300">Travels Legal Declaration</a></li>
              <li><a href="/cancellation-policy" className="hover:text-sky-300">Cancellation Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-4 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} cabzii.in. All rights reserved.
        </div>
      </div>
    </footer>
  );
}