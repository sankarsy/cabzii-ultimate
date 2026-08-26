/**
 * Unique local travel context for city hubs. Not a city-name template.
 * Airport facts live in airports.js — do not duplicate fake terminals here.
 */
export const CITY_HUB_CONTEXT = {
  chennai: {
    travel:
      "Chennai is Cabzii’s home market: IT corridors on OMR and GST Road, hospital clusters in Kilpauk and Vadapalani, and a dense wedding-and-corporate calendar. Riders mix MAA airport runs with local 4-hour packages and one-way drops to Tirupati, Pondicherry and Bengaluru.",
    useCases:
      "Typical bookings are T1/T2/T4 airport pickups, OMR office shuttles, T. Nagar shopping days, and pre-dawn Tirupati darshan departures from Guindy or Anna Nagar."
  },
  vellore: {
    travel:
      "Vellore travel is dominated by CMC Hospital visits, VIT campus transfers and Katpadi Junction arrivals — not a local airport. Families book sedans for same-day Chennai drops and Innovas when patients travel with attendants and luggage.",
    useCases:
      "Common trips: CMC / Scudder Road, VIT and Bagayam, Katpadi railway, Golden Temple (Sripuram), and highway runs to Chennai or Tirupati."
  },
  trichy: {
    travel:
      "Tiruchirappalli combines temple traffic (Srirangam, Rock Fort) with TRZ airport and a large rail junction. Festival weekends fill one-way cabs to Chennai and Madurai; locals use 8-hour packages for multi-stop family darshan.",
    useCases:
      "Book for Srirangam, Rock Fort, Trichy Junction, TRZ airport, and industrial estates around Thuvakudi."
  },
  coimbatore: {
    travel:
      "Coimbatore is a textile-and-engineering hub with CJB airport and a short hill-station hop to Ooty. Corporate travellers want GST-friendly packages; families book Ertiga or Innova for Ooty and Palakkad weekends.",
    useCases:
      "RS Puram, Peelamedu, Gandhipuram, Sitra/CJB airport, and early Ooty or Palani departures."
  },
  madurai: {
    travel:
      "Madurai trips orbit Meenakshi Amman Temple, IXM airport and the Rameswaram pilgrimage corridor. Same-day temple-plus-airport itineraries work best on 8-hour local slabs or a dedicated one-way to Rameswaram.",
    useCases:
      "Anna Nagar, KK Nagar, Simmakkal, Madurai airport, and Rameswaram / Kodaikanal connections."
  },
  salem: {
    travel:
      "Salem sits on the Chennai–Coimbatore highway with a small airport (SXV) and heavy Yercaud weekend demand. Most Cabzii bookings are outstation, not metro-style airport loops.",
    useCases:
      "Fairlands, New Bus Stand, steel-plant areas, Yercaud ghat trips, and NH44 runs to Chennai or Coimbatore."
  },
  erode: {
    travel:
      "Erode is a textile wholesale town without its own passenger airport. Riders transfer via Coimbatore (CJB) or take one-way cabs along NH544 toward Salem and Chennai.",
    useCases:
      "Powerhouse Road, Collectorate, Bhavani / Kodumudi temple legs, and CJB airport transfers."
  },
  hosur: {
    travel:
      "Hosur is an industrial satellite of Bengaluru. Cab demand is factory shifts, Electronic City / Silk Board connections, and Chennai highway trips — not a local airport.",
    useCases:
      "SIPCOT, Bagalur Road, railway station, and BLR airport or Whitefield drops."
  },
  pondicherry: {
    travel:
      "Puducherry weekends arrive on ECR from Chennai: Promenade, White Town heritage stays, and Auroville. PNY airport exists but most visitors still come by road cab.",
    useCases:
      "White Town, Auroville, ECR resorts, and Chennai one-way returns on Sunday evening."
  },
  tirupati: {
    travel:
      "Tirupati is darshan logistics: Alipiri / Vaikuntam queues, TIR airport, and Renigunta railway. Acting drivers and one-way cabs from Chennai or Bengaluru are as common as local hire.",
    useCases:
      "Tirumala drops (where permitted), city hotels, TIR airport, and return one-ways to Chennai or Bengaluru."
  },
  bengaluru: {
    travel:
      "Bengaluru bookings split between BLR airport (often 12-hour buffers), IT parks, and weekend Mysore / Coorg / Tirupati runs. Traffic windows matter more than distance.",
    useCases:
      "Whitefield, Electronic City, Koramangala, Hebbal, and Kempegowda airport pickups."
  },
  hyderabad: {
    travel:
      "Hyderabad airport (HYD) is far from the city core, so pre-booked airport cabs beat last-minute hails. Local demand clusters in Gachibowli, HITEC City and Secunderabad.",
    useCases:
      "RGIA pickup/drop, HITEC City meetings, and outstation to Vijayawada or Bengaluru."
  },
  mysore: {
    travel:
      "Mysore mixes palace-and-dasara tourism with MYQ airport and the Bengaluru corridor. Families prefer Innova for group sightseeing; one-way cabs back to Bengaluru sell out on Sunday nights.",
    useCases:
      "Mysore Palace area, Chamundi Hill, railway station, and Bengaluru one-way."
  },
  kodaikanal: {
    travel:
      "Kodaikanal is a ghat-road destination with no airport. Most guests arrive from Madurai (IXM) or Kodai Road station. SUVs handle hairpin sections better than small sedans when luggage is heavy.",
    useCases:
      "Lake Road hotels, Coaker’s Walk, Kodai Road station, and Madurai airport transfers."
  },
  ooty: {
    travel:
      "Ooty traffic is Coimbatore (CJB) plus the ghat from Mettupalayam. Book earlier on summer weekends. Tempo travellers suit school and family groups; sedans are tight with hill-station luggage.",
    useCases:
      "Charing Cross, Botanical Garden hotels, Coonoor, and CJB airport."
  },
  rameswaram: {
    travel:
      "Rameswaram is a pilgrimage island via Pamban. There is no airport; Madurai (IXM) is the air gateway. Dawn temple slots and same-day Madurai returns are the usual Cabzii pattern.",
    useCases:
      "Ramanathaswamy Temple, Pamban, Agni Theertham, and Madurai one-way."
  },
  tirunelveli: {
    travel:
      "Tirunelveli (Nellai) is a temple-and-court town without its own airport. Tuticorin (TCR) and Madurai (IXM) are the air options; road demand is Nellaiappar Temple, Court, and Kanyakumari legs.",
    useCases:
      "Junction, Palayamkottai, Nellaiappar, and Tuticorin or Madurai airport transfers."
  },
  kanchipuram: {
    travel:
      "Kanchipuram is a silk-and-temple day trip from Chennai: Kamakshi Amman, Ekambareswarar and Varadaraja Perumal. There is no local airport — MAA is the air gateway. Same-day 8-hour packages from Chennai sell better than overnight stays except festival weeks.",
    useCases:
      "Temple circuits, silk-weaving streets, Kanchi mutt area, and Chennai one-way or hourly hire."
  },
  tiruvannamalai: {
    travel:
      "Tiruvannamalai bookings follow Arunachaleswarar Temple, Girivalam full-moon nights and Ramana Ashram. No passenger airport; riders arrive from Chennai (MAA) or Tirupati (TIR). Tempo travellers fill on Pournami weekends.",
    useCases:
      "Temple town hotels, Girivalam start points, ashram area, and Chennai or Tirupati transfers."
  },
  thanjavur: {
    travel:
      "Thanjavur (Tanjore) travel is Brihadeeswarar (Big Temple), palace museum and the Cauvery delta. Air arrivals use Trichy (TRZ). Families book Innova for temple-plus-Kumbakonam loops rather than a second city cab.",
    useCases:
      "Big Temple, Palace, bus stand, TRZ airport transfer, and Kumbakonam / Trichy one-way."
  },
  kumbakonam: {
    travel:
      "Kumbakonam is a Mahamaham and Navagraha hub. There is no airport; Trichy (TRZ) is the usual flight connection. Multi-temple days (Sarangapani, Adi Kumbeswarar, nearby Thirunageswaram) fit 8-hour local slabs or a tempo for family groups.",
    useCases:
      "Town temples, Mahamaham tank area, nearby Navagraha villages, and Trichy airport."
  },
  palani: {
    travel:
      "Palani is Murugan hill-temple logistics: winch/ropeway queues, Dhandayuthapani steps and Palani town hotels. No airport; CJB and IXM are the air options. SUVs handle the ghat better with elderly pilgrims and luggage.",
    useCases:
      "Temple base, winch station, bus stand, and Coimbatore or Madurai airport transfers."
  },
  chidambaram: {
    travel:
      "Chidambaram trips centre on Nataraja Temple (Tillai) and Pichavaram mangrove day legs. No local commercial airport; Pondicherry (PNY) or Trichy (TRZ) are the usual flights. Chennai one-ways are common after darshan.",
    useCases:
      "Temple east/west gopuram hotels, bus stand, Pichavaram, and PNY or Chennai transfers."
  },
  kanyakumari: {
    travel:
      "Kanyakumari is sunrise-at-the-confluence travel: Vivekananda Rock, Thiruvalluvar statue and Kumari Amman. No airport; Tuticorin (TCR) and Madurai (IXM) are the air gateways. Nagercoil is the practical rail/road twin town for overnight stays.",
    useCases:
      "Sunrise viewpoint hotels, ferry jetty, Suchindram, and TCR / Madurai / Nagercoil connections."
  },
  velankanni: {
    travel:
      "Velankanni demand is Basilica of Our Lady of Good Health — feast weeks fill Innovas and tempos. No airport; Trichy (TRZ) is the usual air arrival. Nagapattinam and the ECR-style coast road feed Chennai one-ways.",
    useCases:
      "Basilica, beachfront lodges, Nagapattinam, and Trichy airport transfers."
  },
  thoothukudi: {
    travel:
      "Thoothukudi (Tuticorin) is a port-and-airport city (TCR) with harbour traffic, thermal-plant shifts and the Thiruchendur Murugan corridor. Airport cabs are short compared with Madurai; outstation is usually Tirunelveli or Kanyakumari.",
    useCases:
      "TCR airport, harbour / spit, Palayamkottai Road, and Thiruchendur or Tirunelveli one-way."
  },
  tiruppur: {
    travel:
      "Tiruppur is a knitwear export hub without its own passenger airport. Buyers fly into Coimbatore (CJB) and take a 90-minute cab. Local demand is factory visits, Avinashi Road hotels and Chennai highway drops.",
    useCases:
      "Export clusters, bus stand, Avinashi, and CJB airport transfers."
  },
  nagercoil: {
    travel:
      "Nagercoil is the Kanyakumari district HQ: Nagaraja Temple, Court, and the last big town before the cape. No airport; TCR and Trivandrum (TRV) are used. Most Cabzii trips are Kanyakumari sightseeing plus airport or railway connections.",
    useCases:
      "Town centre, railway, Suchindram, Kanyakumari cape, and Tuticorin airport."
  },
  dindigul: {
    travel:
      "Dindigul sits on the Madurai–Kodaikanal corridor (locks, biryani, textile). No passenger airport; IXM is ~90 minutes. Weekends mix Kodai ghat drops with Madurai temple-plus-airport combos.",
    useCases:
      "Bus stand, Fort Road, Palani Road, and Madurai airport or Kodaikanal transfers."
  },
  karur: {
    travel:
      "Karur is a textile-and-bus-body town on NH44 between Salem and Trichy. No commercial airport; TRZ and CJB are the air options. Bookings are factory-guest shuttles and Chennai/Coimbatore one-ways.",
    useCases:
      "Pasupatheeswarar area, bus stand, industrial estates, and Trichy or Coimbatore airport."
  },
  villupuram: {
    travel:
      "Villupuram is a rail-and-highway junction for Pondicherry, Chidambaram and Tiruvannamalai. No airport; PNY and MAA are nearby. Many ‘Pondy weekend’ cabs actually pick up at Villupuram Junction.",
    useCases:
      "Junction, bus stand, Gingee Road, and Pondicherry or Chennai transfers."
  },
  karaikudi: {
    travel:
      "Karaikudi is Chettinad mansion-and-food country. No airport; Madurai (IXM) and Trichy (TRZ) are the flights. Full-day hires cover Kanadukathan, Athangudi tiles and Chettinad meals better than point-to-point taxis.",
    useCases:
      "Town hotels, Kanadukathan, Athangudi, and Madurai or Trichy airport."
  },
  theni: {
    travel:
      "Theni is the Cumbum valley gateway: Suruli Falls, Meghamalai and the western approach to Kodaikanal. No airport; IXM is the air option. SUVs are preferred for ghat luggage and family groups.",
    useCases:
      "Bus stand, Cumbum Road, Suruli, and Madurai airport or Kodai west ghat."
  },
  nagapattinam: {
    travel:
      "Nagapattinam is a coastal district HQ next to Velankanni. No airport; Trichy (TRZ) is the usual flight. Bookings mix port/town work with basilica feast traffic and Chennai one-ways along the coast.",
    useCases:
      "Beach Road, bus stand, Velankanni, and Trichy airport."
  },
  thiruchendur: {
    travel:
      "Thiruchendur is the seashore Murugan temple (Arulmigu Subramaniya Swamy). No airport; Tuticorin (TCR) is about an hour. Dawn seashore darshan plus same-day Tuticorin airport returns are the typical Cabzii pattern.",
    useCases:
      "Temple east gopuram, beach lodges, Tiruchendur station, and TCR airport."
  },
  mumbai: {
    travel:
      "Mumbai airport (BOM) and intercity corridors to Pune and Nashik drive Cabzii-style packages more than inner-city metre taxis. Pre-book for terminal-specific pickup.",
    useCases:
      "Domestic/international terminals, Bandra–Kurla, and Pune one-way."
  },
  delhi: {
    travel:
      "Delhi NCR airport (DEL) transfers and outstation to Agra or Jaipur are the relevant Cabzii use cases — not a substitute for local app cabs inside the ring road.",
    useCases:
      "IGI terminals, Aerocity hotels, and Agra / Jaipur highway trips."
  },
  pune: {
    travel:
      "Pune airport (PNQ) plus Mumbai and Mahabaleshwar weekends. IT parks in Hinjawadi book hourly packages; families book Innova for hill stations.",
    useCases:
      "PNQ airport, Hinjawadi, and Mumbai or Mahabaleshwar outstation."
  },
  kolkata: {
    travel:
      "Kolkata (CCU) airport and Howrah-side outstation to Digha or Puri are the typical long-form bookings.",
    useCases:
      "NSCBI airport, Park Street hotels, and Digha / Puri one-way."
  },
  kochi: {
    travel:
      "Kochi (COK) sits away from Ernakulam city, so airport cabs are planned, not spontaneous. Munnar and Alleppey are the common outstation pairs.",
    useCases:
      "COK airport, Marine Drive / MG Road, and Munnar or Alleppey."
  },
  visakhapatnam: {
    travel:
      "Vizag (VTZ) combines airport, port, and Araku / weekend beach demand. SUVs are preferred for ghat sections to Araku.",
    useCases:
      "VTZ airport, RTC complex, Beach Road, and Araku outstation."
  },
  goa: {
    travel:
      "Goa airport cabs (GOI / Mopa depending on flight) plus North–South hotel transfers. Full-day hire beats multiple short hails for multi-beach days.",
    useCases:
      "Airport pickup, Calangute / Panaji hotels, and South Goa day hire."
  },
  jaipur: {
    travel:
      "Jaipur (JAI) is airport plus Amber / city-palace circuits and Agra or Delhi one-ways. 8-hour local packages fit a typical tourist day.",
    useCases:
      "JAI airport, MI Road hotels, and Agra / Delhi highway."
  },
  ahmedabad: {
    travel:
      "Ahmedabad (AMD) airport and Gandhinagar / Vadodara outstation. Wedding season fills Innova and tempo inventory.",
    useCases:
      "AMD airport, SG Highway, and Vadodara one-way."
  },
  chandigarh: {
    travel:
      "Chandigarh (IXC) serves the tricity and hill stations (Shimla, Manali). SUVs are the usual outstation choice.",
    useCases:
      "IXC airport, Sector hotels, and Shimla / Manali packages."
  }
};

export const DRIVER_CITY_CONTEXT = {
  chennai: {
    travel:
      "Acting drivers in Chennai are booked for OMR congestion, MAA airport runs in the owner’s car, and outstation darshan trips where the family wants their own vehicle.",
    useCases: "Airport chauffeur, wedding-day driving, and Chennai–Tirupati in your car."
  },
  trichy: {
    travel:
      "Trichy acting-driver demand is temple multi-stop days (Srirangam plus Rock Fort) and TRZ airport drops in the customer’s car — not a public driver directory.",
    useCases: "Festival darshan days, hospital visits, and airport chauffeur."
  },
  coimbatore: {
    travel:
      "Coimbatore owners hire chauffeurs for CJB airport and Ooty ghats so they can rest in their own SUV.",
    useCases: "Airport, Ooty weekend, and factory-guest driving."
  },
  madurai: {
    travel:
      "Madurai acting drivers cover Meenakshi Temple circuits and IXM airport in the guest’s vehicle, plus Rameswaram highway days.",
    useCases: "Temple days, airport, and pilgrimage chauffeur."
  },
  salem: {
    travel:
      "Salem chauffeur hire is mostly Yercaud ghat driving and NH44 outstation in the owner’s car.",
    useCases: "Yercaud, Chennai highway, and local wedding cars."
  },
  erode: {
    travel:
      "Erode acting-driver bookings are wholesale-market days and Coimbatore airport transfers in the customer’s car (Erode has no passenger airport).",
    useCases: "CJB airport chauffeur and textile-market errands."
  },
  hosur: {
    travel:
      "Hosur owners often need a driver for Bengaluru traffic and BLR airport while keeping their own car.",
    useCases: "BLR airport, Electronic City, and factory visitor driving."
  },
  pondicherry: {
    travel:
      "Puducherry acting drivers are weekend ECR returns to Chennai and White Town hotel-to-Auroville hops in the guest’s car.",
    useCases: "ECR return chauffeur and local heritage-stay driving."
  },
  tirupati: {
    travel:
      "Tirupati chauffeur hire is darshan logistics in the family’s car — city hotels to queue complexes — plus TIR airport.",
    useCases: "Temple-day driving and airport chauffeur."
  },
  bengaluru: {
    travel:
      "Bengaluru acting drivers absorb traffic and BLR airport loops so owners are not driving peak hours.",
    useCases: "Airport chauffeur, IT-park days, and Mysore weekend."
  },
  hyderabad: {
    travel:
      "Hyderabad chauffeur demand is the long HYD airport run and HITEC City meeting days in a personal car.",
    useCases: "RGIA chauffeur and corporate city driving."
  },
  mysore: {
    travel:
      "Mysore acting drivers support sightseeing days and Bengaluru Sunday returns in the owner’s vehicle.",
    useCases: "Palace circuit and Bengaluru highway chauffeur."
  },
  kodaikanal: {
    travel:
      "Kodaikanal ghat driving is the main reason visitors hire an acting driver for their own car (no local airport).",
    useCases: "Ghat chauffeur from Madurai or Kodai Road."
  },
  ooty: {
    travel:
      "Ooty acting drivers handle Coonoor loops and CJB airport returns in the guest’s SUV.",
    useCases: "Hill-station chauffeur and Coimbatore airport."
  },
  rameswaram: {
    travel:
      "Rameswaram chauffeur hire is temple-plus-Pamban days in a family car after a Madurai arrival (no island airport).",
    useCases: "Pilgrimage chauffeur and Madurai return."
  },
  tirunelveli: {
    travel:
      "Nellai acting drivers cover temple towns and Tuticorin/Madurai airport transfers in the owner’s car.",
    useCases: "Airport chauffeur and Kanyakumari day driving."
  },
  kanchipuram: {
    travel:
      "Kanchipuram acting drivers are temple-circuit days in the family’s car after a Chennai arrival (no local airport).",
    useCases: "Multi-temple chauffeur and MAA transfer in your car."
  },
  tiruvannamalai: {
    travel:
      "Tiruvannamalai chauffeur hire is Girivalam nights and temple-town hops in the owner’s vehicle — not a public driver list.",
    useCases: "Pournami driving and Chennai/Tirupati highway chauffeur."
  },
  thanjavur: {
    travel:
      "Thanjavur acting drivers cover Big Temple plus Kumbakonam temple loops in the guest’s car, with TRZ airport as the air leg.",
    useCases: "Temple-day chauffeur and Trichy airport."
  },
  kumbakonam: {
    travel:
      "Kumbakonam chauffeur packages are Navagraha village circuits in a personal car so elders are not changing cabs at each shrine.",
    useCases: "Temple-circuit driving and Trichy airport chauffeur."
  },
  palani: {
    travel:
      "Palani acting drivers handle ghat approaches and temple-base shuttles in the owner’s SUV (no local airport).",
    useCases: "Hill-temple chauffeur and CJB or Madurai airport."
  },
  chidambaram: {
    travel:
      "Chidambaram chauffeur hire is Nataraja Temple days and Pichavaram in the family’s car, plus Pondicherry or Chennai returns.",
    useCases: "Temple chauffeur and PNY / Chennai highway."
  },
  kanyakumari: {
    travel:
      "Kanyakumari acting drivers cover sunrise rock-ferry timing and Suchindram in the guest’s car after a Tuticorin or Madurai arrival.",
    useCases: "Cape sightseeing chauffeur and TCR airport."
  },
  velankanni: {
    travel:
      "Velankanni chauffeur demand is basilica feast days in the family’s vehicle, with Trichy airport as the usual air connection.",
    useCases: "Shrine-day driving and TRZ chauffeur."
  },
  thoothukudi: {
    travel:
      "Thoothukudi acting drivers cover TCR airport and Thiruchendur seashore temple in the owner’s car.",
    useCases: "Airport chauffeur and harbour / temple driving."
  },
  tiruppur: {
    travel:
      "Tiruppur owners hire chauffeurs for Coimbatore airport (CJB) and factory-guest days in a personal car.",
    useCases: "CJB chauffeur and buyer-visit driving."
  },
  nagercoil: {
    travel:
      "Nagercoil acting drivers handle Kanyakumari cape loops and Tuticorin airport in the guest’s vehicle.",
    useCases: "Cape chauffeur and TCR airport."
  },
  dindigul: {
    travel:
      "Dindigul chauffeur hire is Kodaikanal ghat driving and Madurai airport in the owner’s SUV.",
    useCases: "Ghat chauffeur and IXM airport."
  },
  karur: {
    travel:
      "Karur acting drivers cover NH44 factory visits and Trichy or Coimbatore airport in the customer’s car.",
    useCases: "Airport chauffeur and industrial-estate driving."
  },
  villupuram: {
    travel:
      "Villupuram chauffeur bookings are Pondicherry weekends and Chennai highway in the owner’s car.",
    useCases: "PNY / MAA chauffeur and junction pickups."
  },
  karaikudi: {
    travel:
      "Karaikudi acting drivers cover Chettinad mansion circuits in a personal car after a Madurai or Trichy arrival.",
    useCases: "Heritage-day chauffeur and airport transfer."
  },
  theni: {
    travel:
      "Theni chauffeur hire is Cumbum / Meghamalai and Kodai west ghat in the owner’s SUV (Madurai airport, no local terminal).",
    useCases: "Hill chauffeur and IXM airport."
  },
  nagapattinam: {
    travel:
      "Nagapattinam acting drivers cover Velankanni basilica days and Trichy airport in the family’s car.",
    useCases: "Coastal shrine chauffeur and TRZ airport."
  },
  thiruchendur: {
    travel:
      "Thiruchendur chauffeur packages are seashore temple timing plus Tuticorin airport in the guest’s vehicle.",
    useCases: "Dawn darshan driving and TCR chauffeur."
  },
  mumbai: {
    travel:
      "Mumbai acting-driver bookings on Cabzii are typically airport or outstation chauffeur in the owner’s car, not inner-city hailing.",
    useCases: "BOM chauffeur and Pune highway."
  },
  delhi: {
    travel:
      "Delhi NCR chauffeur hire is DEL airport and Agra/Jaipur outstation in a personal vehicle.",
    useCases: "IGI chauffeur and Golden Triangle highway."
  },
  pune: {
    travel:
      "Pune acting drivers cover PNQ airport and Mumbai/Mahabaleshwar days in the owner’s car.",
    useCases: "Airport and weekend hill chauffeur."
  },
  kolkata: {
    travel:
      "Kolkata chauffeur packages are CCU airport and Digha/Puri outstation in a personal car.",
    useCases: "Airport and weekend chauffeur."
  },
  kochi: {
    travel:
      "Kochi acting drivers are COK airport and Munnar ghat days in the guest’s vehicle.",
    useCases: "Airport and hill-station chauffeur."
  },
  visakhapatnam: {
    travel:
      "Vizag chauffeur hire is VTZ airport and Araku ghat driving in the owner’s SUV.",
    useCases: "Airport and Araku chauffeur."
  },
  goa: {
    travel:
      "Goa acting drivers cover airport pickup and multi-beach days so visitors are not driving unfamiliar roads.",
    useCases: "Airport chauffeur and full-day North/South driving."
  },
  jaipur: {
    travel:
      "Jaipur chauffeur packages are JAI airport and city-palace circuits in a personal car.",
    useCases: "Airport and tourist-day driving."
  },
  ahmedabad: {
    travel:
      "Ahmedabad acting drivers cover AMD airport and wedding-day cars.",
    useCases: "Airport and event chauffeur."
  },
  chandigarh: {
    travel:
      "Chandigarh chauffeur hire is IXC airport and Shimla/Manali in the owner’s SUV.",
    useCases: "Airport and hill-station chauffeur."
  }
};

export function cityHubContext(slug) {
  return CITY_HUB_CONTEXT[slug] || null;
}

export function driverCityContext(slug) {
  return DRIVER_CITY_CONTEXT[slug] || null;
}
