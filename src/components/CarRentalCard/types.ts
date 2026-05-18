export type TripType = "local" | "outstation";
export type PackageId = "local_4hr" | "local_8hr" | "out_oneway" | "out_twoway";

export interface Package {
  id: PackageId;
  label: string;
  subLabel?: string;
  originalPrice: number;
  discountPct: number;
  tripType: TripType;
}

export interface CarRentalCardProps {
  carName?: string;
  carType?: string;
  location?: string;
  rating?: number;
  seating?: string;
  driverBatta?: number;
  extraKmRate?: number;
  extraHrRate?: number;
  onBook?: (pkg: Package) => void;
}
