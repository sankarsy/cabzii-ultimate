function Mark({ children }) {
  return (
    <svg viewBox="0 0 64 40" className="h-8 w-11" aria-hidden>
      {children}
    </svg>
  );
}

function Wheels({ x1 = 16, x2 = 48 }) {
  return (
    <g>
      <circle cx={x1} cy="31" r="4.2" fill="#141820" />
      <circle cx={x1} cy="31" r="1.7" fill="#E7EDF6" />
      <circle cx={x2} cy="31" r="4.2" fill="#141820" />
      <circle cx={x2} cy="31" r="1.7" fill="#E7EDF6" />
    </g>
  );
}

function LocalMark() {
  return (
    <Mark>
      <path d="M6 31V20c0-4 3-7 8-8h16c5 0 9 2 12 7l5 6h8v6H6z" fill="#1E40AF" />
      <path d="M16 18h10v7H14zM28 18h10l4 7H28z" fill="#D5E4FA" />
      <path d="M52 22h6v3h-6z" fill="#F4C542" />
      <Wheels x1="16" x2="46" />
    </Mark>
  );
}

function OutstationMark() {
  return (
    <Mark>
      <path d="M4 32h56" stroke="#94A3B8" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M6 28c1-6 4-10 10-11h12l6-8c3-4 7-6 12-6h6c4 0 7 2 9 6l5 8h4v11H6z" fill="#2450C8" />
      <path d="M34 16h8l-2 8h-8zM44 10h6c3 0 5 2 7 6l2 8H44z" fill="#D5E4FA" />
      <Wheels x1="18" x2="48" />
    </Mark>
  );
}

function AirportMark() {
  return (
    <Mark>
      <path d="M40 6h6l8 6h-7l5 4h-6l-4-4h-6l2 4h-5l-3-4 4-2z" fill="#0A1640" />
      <path d="M4 31V21c0-3 3-6 7-6h14c4 0 8 2 11 6l4 5h12v5H4z" fill="#1E40AF" />
      <path d="M12 20h9v6H10zM23 20h9l3 6H23z" fill="#D5E4FA" />
      <Wheels x1="14" x2="42" />
    </Mark>
  );
}

function MonthlyMark() {
  return (
    <Mark>
      <rect x="40" y="4" width="18" height="16" rx="3" fill="#fff" stroke="#1E40AF" strokeWidth="1.6" />
      <path d="M40 9h18" stroke="#1E40AF" strokeWidth="1.6" />
      <path d="M45 4v4M53 4v4" stroke="#1E40AF" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M4 31V20c0-4 3-7 8-8h14c5 0 8 2 11 6l4 6H4z" fill="#1E40AF" />
      <path d="M14 18h8v6H12zM24 18h8l3 6H24z" fill="#D5E4FA" />
      <Wheels x1="14" x2="34" />
    </Mark>
  );
}

function CorporateMark() {
  return (
    <Mark>
      <path d="M4 32V14h10v18H4zM8 18h3v3H8zM8 23h3v3H8z" fill="#0A1640" />
      <path d="M16 31V20c0-3 2-6 6-6h12c4 0 7 2 10 6l4 5h6v6H16z" fill="#1E40AF" />
      <path d="M24 18h8v6h-9zM34 18h8l3 6H34z" fill="#D5E4FA" />
      <Wheels x1="26" x2="48" />
    </Mark>
  );
}

function ValetMark() {
  return (
    <Mark>
      <path d="M46 8c4 0 8 3 8 7 0 5-6 9-8 11-2-2-8-6-8-11 0-4 4-7 8-7z" fill="#1E40AF" />
      <circle cx="46" cy="15" r="2" fill="#F4F7FB" />
      <path d="M4 31V20c0-4 3-7 8-8h14c5 0 8 2 11 6l4 6H4z" fill="#1E40AF" />
      <path d="M14 18h8v6H12zM24 18h8l3 6H24z" fill="#D5E4FA" />
      <Wheels x1="14" x2="34" />
    </Mark>
  );
}

const MARKS = {
  local: LocalMark,
  outstation: OutstationMark,
  airport: AirportMark,
  school: MonthlyMark,
  corporate: CorporateMark,
  valet: ValetMark
};

export default function CallDriverServiceIcon({ id }) {
  const Icon = MARKS[id] || LocalMark;
  return <Icon />;
}
