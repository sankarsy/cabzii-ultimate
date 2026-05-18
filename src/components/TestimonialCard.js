export default function TestimonialCard({ testimonial }) {
  return (
    <article className="flex h-full min-h-[220px] flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-md transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-xl">
      <p className="text-sm leading-6 text-slate-700">"{testimonial.message}"</p>
      <div className="mt-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">{testimonial.name}</h3>
          <p className="text-xs text-slate-500">{testimonial.location}</p>
        </div>
        <span className="text-sm font-semibold text-fuchsia-600">{`${"★".repeat(testimonial.rating)}${"☆".repeat(5 - testimonial.rating)}`}</span>
      </div>
    </article>
  );
}
