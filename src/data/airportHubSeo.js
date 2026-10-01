/**
 * Honest airport-hub copy. No 24/7 product claim, no competitor reviews,
 * no flight-desk promises Cabzii does not operate, no 882-route dumps.
 */

export const AIRPORT_HUB_SEO = {
  chennai: {
    title: "Chennai Airport Cabs | Pickup & Drop | Cabzii",
    description:
      "Book Chennai airport (MAA) pickup and drop on Cabzii. Sedan, SUV and Innova. Pay 50% to confirm. Fuel and driver included; parking and tolls extra.",
    keywords:
      "chennai airport taxi, chennai airport cab booking, maa airport pickup, chennai airport drop cab, airport taxi chennai",
    h1: "Chennai Airport Cabs | Cabzii Airport Pickup & Drop",
    lead: "Book pickup or drop at Chennai International Airport (MAA). Fares show before you pay.",
    aboutCity:
      "Chennai International Airport (MAA) has domestic and international terminals at Meenambakkam / Tirusulam. Cabzii books a cab for the published pickup time — share the terminal and flight time after confirmation so the assigned driver can plan waiting.",
    airportDetails:
      "Chennai International Airport (MAA) — domestic and international terminals. Enter the terminal you will use as pickup or drop. Parking and tolls are extra unless listed on the quote.",
    drops: [
      {
        title: "T. Nagar",
        body: "Common city drop from MAA. Enter the exact street so the assigned driver can reach the door."
      },
      {
        title: "Anna Nagar",
        body: "North Chennai drop. Use Airport pickup with Anna Nagar as To, or reverse for a drop to the terminal."
      },
      {
        title: "OMR / Velachery",
        body: "IT corridor drop. Luggage-heavy groups usually compare SUV or Innova on this page."
      },
      {
        title: "Maduravoyal / Porur",
        body: "West Chennai drop including Cabzii’s published office area. Confirm the pin on the form above."
      }
    ]
  },
  trichy: {
    title: "Trichy Airport Cabs | Pickup & Drop | Cabzii",
    description:
      "Book Trichy airport (TRZ) pickup and drop on Cabzii. Sedan, SUV and Innova. Pay 50% to confirm. Fuel and driver included; parking and tolls extra.",
    keywords:
      "trichy airport taxi, tiruchi airport cab, trz airport pickup, trichy airport drop, airport taxi trichy",
    h1: "Trichy Airport Cabs | Cabzii Airport Pickup & Drop",
    lead: "Book pickup or drop at Tiruchirappalli International Airport (TRZ). Fares show before you pay.",
    aboutCity:
      "Tiruchirappalli International Airport (TRZ) serves Trichy / Tiruchi. Cabzii covers terminal pickup, city drops such as Srirangam and Central Bus Stand, and onward outstation from the airport city — after you confirm the fare and pay the published 50% advance.",
    airportDetails:
      "Tiruchirappalli International Airport (TRZ). Enter TRZ or the terminal name as From for arrivals. Parking and extra km are listed on the quote.",
    drops: [
      {
        title: "Srirangam",
        body: "Temple-side drop from TRZ. Share the gopuram or hotel landmark in the drop field."
      },
      {
        title: "Central Bus Stand",
        body: "City interchange drop. Use Airport tab with the bus stand as To."
      },
      {
        title: "Cantonment / Thillai Nagar",
        body: "Hotel and residential drops. Enter the exact street after you land."
      },
      {
        title: "Rockfort",
        body: "City-centre temple drop. Treat it as a local airport transfer, not an all-day stand unless you book hourly."
      }
    ]
  },
  madurai: {
    title: "Madurai Airport Cabs | Pickup & Drop | Cabzii",
    description:
      "Book Madurai airport (IXM) pickup and drop on Cabzii. Sedan, SUV and Innova. Pay 50% to confirm. Fuel and driver included; parking and tolls extra.",
    keywords:
      "madurai airport taxi, madurai airport cab booking, ixm airport pickup, madurai airport drop, airport taxi madurai",
    h1: "Madurai Airport Cabs | Cabzii Airport Pickup & Drop",
    lead: "Book pickup or drop at Madurai Airport (IXM). Fares show before you pay.",
    aboutCity:
      "Madurai Airport (IXM) is the usual air gateway for the temple city. Cabzii books pickup from the terminal to Anna Nagar, Meenakshi Temple area or hotels, and the reverse drop for departures. This is a confirmed cab booking — not a walk-up airport counter.",
    airportDetails:
      "Madurai Airport (IXM). Use Airport pickup for arrivals and Airport drop for departures. Parking at the terminal is extra unless listed.",
    drops: [
      {
        title: "Anna Nagar",
        body: "Common residential drop from IXM. Enter the colony or street name as To."
      },
      {
        title: "Meenakshi Amman Temple",
        body: "City-centre temple drop. Share the gopuram side you will use."
      },
      {
        title: "Mattuthavani",
        body: "Bus terminus drop. Useful when connecting to an outstation bus after the flight."
      },
      {
        title: "KK Nagar / Tallakulam",
        body: "Hotel and hospital-side drops. Confirm waiting only if you book an hourly package."
      }
    ]
  },
  coimbatore: {
    title: "Coimbatore Airport Cabs | Pickup & Drop | Cabzii",
    description:
      "Book Coimbatore airport (CJB) pickup and drop on Cabzii. Sedan, SUV and Innova. Pay 50% to confirm. Fuel and driver included; parking and tolls extra.",
    keywords:
      "coimbatore airport taxi, cjb airport cab, coimbatore airport pickup, coimbatore airport drop, airport taxi coimbatore",
    h1: "Coimbatore Airport Cabs | Cabzii Airport Pickup & Drop",
    lead: "Book pickup or drop at Coimbatore International Airport (CJB). Fares show before you pay.",
    aboutCity:
      "Coimbatore International Airport (CJB) at Peelamedu / Sitra is the usual gateway for the city and for Ooty road trips. Cabzii books terminal pickup and city drops such as RS Puram and Gandhipuram. Hill-station onward travel is a separate outstation quote on this site.",
    airportDetails:
      "Coimbatore International Airport (CJB). Enter CJB or Coimbatore Airport as From for arrivals. Parking and hill-station extra km are extra unless listed.",
    drops: [
      {
        title: "RS Puram",
        body: "Central city drop from CJB. Enter the street or hotel name as To."
      },
      {
        title: "Gandhipuram",
        body: "Bus-stand area drop. Useful for connecting local buses after the flight."
      },
      {
        title: "Peelamedu / Sitra",
        body: "Near-airport neighbourhoods. Short transfers still use the Airport tab so the quote includes terminal parking rules."
      },
      {
        title: "Ooty / Coonoor onward",
        body: "Not a local airport drop. Search Outstation from Coimbatore after you land, or book the corridor before you fly."
      }
    ]
  }
};

export function airportHubSeo(citySlug) {
  return AIRPORT_HUB_SEO[String(citySlug || "").toLowerCase()] || null;
}
