import { Suspense } from "react";
import HolidaysListPage from "../../components/HolidaysListPage";

export default function HolidaysPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl px-4 py-16 text-center text-slate-500">Loading holidays…</div>
      }
    >
      <HolidaysListPage />
    </Suspense>
  );
}
