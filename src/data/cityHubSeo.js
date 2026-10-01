/**
 * Honest city-hub copy for ranking landings. No 24/7 product claim, no competitor reviews,
 * no 882-route dumps. Admin CMS overlays these fields when saved.
 */

export const CITY_HUB_SEO = {
  chennai: {
    title: "Best Cab Services in Chennai | Cabzii",
    description:
      "Book local, airport and outstation cabs in Chennai on Cabzii. Sedan, SUV and Innova. Pay 50% to confirm. Fuel and driver included; tolls extra.",
    keywords:
      "cab booking chennai, taxi service chennai, airport taxi chennai, outstation cab chennai, local cab chennai",
    h1: "Best Cab Services in Chennai - Cabzii",
    lead: "Book airport, local and outstation cabs in Chennai. Fares show before you pay.",
    aboutCity:
      "Cabzii serves Chennai neighbourhoods including T. Nagar, Anna Nagar, Velachery, OMR, Tambaram and Maduravoyal. Marina Beach, Kapaleeshwarar Temple, Guindy and Fort St. George are common local drops. Airport transfers use Chennai International Airport (MAA).",
    places: [
      {
        title: "Marina Beach",
        body: "Long urban beach. Book a local cab if you want door pickup without parking in the beach stretch."
      },
      {
        title: "Kapaleeshwarar Temple",
        body: "Mylapore temple drop. Enter the exact street as pickup or drop on the form above."
      },
      {
        title: "Guindy National Park",
        body: "City green cover. Use a local or hourly cab if you need waiting time."
      },
      {
        title: "Valluvar Kottam",
        body: "Nungambakkam monument. Combine with other city drops on an hourly package if you have several stops."
      }
    ]
  },
  trichy: {
    title: "Best Cab Services in Trichy | Cabzii",
    description:
      "Book Trichy cabs on Cabzii — local, airport and outstation. Rockfort and Srirangam drops. Pay 50% to confirm. Fuel and driver included; tolls extra.",
    keywords:
      "cab booking trichy, taxi service trichy, trichy airport taxi, outstation cab trichy, tiruchi cab",
    h1: "Best Cab Services in Trichy - Cabzii",
    lead: "Book local and outstation cabs in Trichy. Fares show before you pay.",
    aboutCity:
      "Tiruchirappalli (Trichy / Tiruchi) is a junction city. Common drops include Rockfort, Srirangam, Central Bus Stand and Trichy Airport (TRZ). Cabzii books the cab after you confirm — a driver is assigned for that trip.",
    places: [
      {
        title: "Rockfort Temple",
        body: "Hill temple above the city. Share the exact pickup landmark so the assigned driver can reach you."
      },
      {
        title: "Sri Ranganathaswamy Temple",
        body: "Srirangam temple complex. Use a local cab for the drop and a return if you need waiting."
      },
      {
        title: "Kallanai Dam",
        body: "Ancient dam outside the city core. Treat it as a short outstation or hourly hire, not a 24/7 stand."
      },
      {
        title: "Butterfly Park",
        body: "Family stop. Book date and time on this page, then pay the published advance."
      }
    ]
  },
  madurai: {
    title: "Best Cab Services in Madurai | Cabzii",
    description:
      "Book Madurai cabs on Cabzii — local, airport and outstation to Rameswaram or Kanyakumari. Pay 50% to confirm. Fuel and driver included; tolls extra.",
    keywords:
      "cab booking madurai, taxi service madurai, madurai airport taxi, outstation cab madurai, meenakshi temple cab",
    h1: "Best Cab Services in Madurai - Cabzii",
    lead: "Book local and outstation cabs in Madurai. Fares show before you pay.",
    aboutCity:
      "Madurai is the temple city around Meenakshi Amman Temple. Cabzii covers city drops, Madurai Airport (IXM) and outstation corridors such as Rameswaram and Kanyakumari. Tolls and parking are extra unless listed on the quote.",
    places: [
      {
        title: "Meenakshi Amman Temple",
        body: "City centre temple. Enter the exact gopuram-side street as pickup or drop."
      },
      {
        title: "Thirumalai Nayakkar Palace",
        body: "Palace drop in the old city. Combine with temple stops on an hourly package if you need waiting."
      },
      {
        title: "Gandhi Memorial Museum",
        body: "Tamukkam area. Book a local cab with the museum name in the drop field."
      },
      {
        title: "Vandiyur Mariamman Teppakulam",
        body: "Tank and temple precinct. Share a nearby landmark if the pin is hard to find."
      }
    ]
  },
  coimbatore: {
    title: "Best Cab Services in Coimbatore | Cabzii",
    description:
      "Book Coimbatore cabs on Cabzii — local, airport and outstation to Ooty, Tiruppur or Palani. Pay 50% to confirm. Fuel and driver included; tolls extra.",
    keywords:
      "cab booking coimbatore, taxi service coimbatore, coimbatore airport taxi, outstation cab coimbatore, ooty cab from coimbatore",
    h1: "Best Cab Services in Coimbatore - Cabzii",
    lead: "Book local and outstation cabs in Coimbatore. Fares show before you pay.",
    aboutCity:
      "Coimbatore is the textile and industrial hub and the usual road gateway to Ooty and Coonoor. Cabzii books city, Coimbatore Airport (CJB) and hill-station outstation trips. Fares on this page are Cabzii catalog quotes, not a competitor dump.",
    places: [
      {
        title: "Marudamalai Temple",
        body: "Hill Murugan temple. Book a local or short outstation cab and share the temple parking landmark."
      },
      {
        title: "Isha Yoga Center",
        body: "Outskirts ashram. Treat it as a point-to-point cab with the exact gate you will use."
      },
      {
        title: "Black Thunder",
        body: "Mettupalayam-side water park. Family groups usually need SUV or Innova — compare on this page."
      },
      {
        title: "Siruvani",
        body: "Reservoir and forest road. Confirm waiting time on hourly or round-trip, not an assumed all-day stand."
      }
    ]
  }
};

export function cityHubSeo(citySlug) {
  return CITY_HUB_SEO[String(citySlug || "").toLowerCase()] || null;
}
