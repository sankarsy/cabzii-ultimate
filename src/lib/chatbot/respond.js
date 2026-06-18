const QUICK_LINKS = {
  cabs: "/cabs",
  drivers: "/drivers",
  holidays: "/holidays",
  booking: "/cabs",
  testimonials: "/testimonials",
  locations: "/locations",
  cancellation: "/cancellation-policy"
};

function pick(text, patterns) {
  const t = String(text || "").toLowerCase();
  return patterns.some((p) => (typeof p === "string" ? t.includes(p) : p.test(t)));
}

function lastAssistantText(history) {
  const last = [...history].reverse().find((m) => m.role === "assistant");
  return String(last?.content || last?.reply || "");
}

/** Rule-based travel assistant replies (Cabzii scope). */
export function generateChatReply(message, { name = "there", history = [] } = {}) {
  const text = String(message || "").trim();
  if (!text) {
    return {
      reply: "Please type your question — I can help with cabs, fares, airport transfers, and bookings."
    };
  }

  const firstName = String(name || "there").split(/\s+/)[0];

  if (pick(text, ["hi", "hello", "hey", "good morning", "good evening", "namaste"])) {
    return {
      reply: `Hi ${firstName}! 👋 I'm Zii, your Cabzii travel assistant. Ask me about cab booking, airport taxis, outstation trips, acting drivers, or holiday packages.`,
      suggestions: ["Book a cab", "Airport taxi fare", "Outstation routes", "Talk to support"]
    };
  }

  if (pick(text, ["airport", "flight", "terminal", "maa", "chennai airport"])) {
    return {
      reply:
        "Cabzii offers 24/7 airport taxi in Chennai and other cities — sedan, Innova & SUV with fixed pickup charges. Share your terminal and time for the best vehicle match.",
      suggestions: ["Book airport cab", "Fare estimate", "24/7 support"]
    };
  }

  if (pick(text, ["outstation", "one way", "oneway", "intercity", "highway"])) {
    return {
      reply:
        "Outstation cabs include one-way and round-trip options with transparent per-km pricing. Popular routes: Chennai ↔ Bangalore, Pondicherry, Tirupati, Coimbatore.",
      suggestions: ["Chennai to Bangalore", "Book outstation cab", "Round trip fare"]
    };
  }

  if (pick(text, ["bangalore", "bengaluru", "blr"])) {
    return {
      reply: "Chennai to Bangalore is one of our most booked routes. Sedan and Innova options with upfront fares — no hidden charges.",
      suggestions: ["Book Chennai–Bangalore", "SUV fare", "One-way cab"]
    };
  }

  if (pick(text, ["pondicherry", "puducherry", "pondy"])) {
    return {
      reply: "Chennai to Pondicherry cabs are available daily. Enjoy a comfortable coastal drive with professional drivers.",
      suggestions: ["Book Pondicherry cab", "Day trip package"]
    };
  }

  if (pick(text, ["tirupati", "temple"])) {
    return {
      reply: "We arrange Chennai to Tirupati cabs for darshan trips — early morning pickups and flexible return options.",
      suggestions: ["Book Tirupati cab", "Round trip"]
    };
  }

  if (pick(text, ["driver", "acting", "chauffeur", "hire driver"])) {
    return {
      reply: `Need a professional acting driver? Cabzii lists verified drivers for local and outstation hire.\n\n👉 Browse: ${QUICK_LINKS.drivers}`,
      suggestions: ["Hire acting driver", "Daily driver hire"]
    };
  }

  if (pick(text, ["holiday", "tour", "package", "trip plan"])) {
    return {
      reply: `Explore curated holiday packages across South India — beaches, temples, hill stations & more.\n\n👉 ${QUICK_LINKS.holidays}`,
      suggestions: ["Weekend getaways", "Family tour packages"]
    };
  }

  if (pick(text, ["fare", "price", "cost", "charge", "how much", "rate", "₹", "rupee"])) {
    return {
      reply:
        "Fares depend on route, vehicle type (Sedan / Innova / SUV), and trip type (local, airport, outstation). Cabzii shows upfront pricing before you confirm — enter your route on the search page for an instant estimate.",
      suggestions: ["Get fare estimate", "Book a cab", "Sedan vs Innova"]
    };
  }

  if (pick(text, ["sedan", "innova", "suv", "ertiga", "vehicle", "car type"])) {
    return {
      reply:
        "Sedan — budget-friendly for 4 passengers.\nInnova / Ertiga — extra space for families.\nSUV — premium comfort for long outstation trips.\n\nTell me your route and passenger count for a recommendation."
    };
  }

  if (pick(text, ["otp", "secure", "verification", "login"])) {
    return {
      reply:
        "Every Cabzii booking is OTP-secured. You'll receive a one-time password on your mobile to confirm the trip — this keeps your booking safe and verified."
    };
  }

  if (pick(text, ["cancel", "refund", "cancellation"])) {
    return {
      reply: `Cancellation terms depend on how close you are to pickup time. See ${QUICK_LINKS.cancellation} or ask support for your specific booking.`,
      suggestions: ["Talk to support", "Book a cab"]
    };
  }

  if (pick(text, ["pay", "payment", "upi", "cash", "online"])) {
    return {
      reply:
        "Cabzii supports flexible payment options as shown at checkout — pay online or as agreed with your assigned vendor. Fares are shared upfront before confirmation."
    };
  }

  if (pick(text, ["support", "help", "call", "phone", "whatsapp", "contact", "human", "agent"])) {
    return {
      reply: `Our team is available 24/7. Use the Call or WhatsApp buttons on the site, or visit ${QUICK_LINKS.locations} for local support details.`,
      suggestions: ["Book a cab", "Airport taxi"]
    };
  }

  if (pick(text, ["review", "rating", "trust", "verified"])) {
    return {
      reply: `Cabzii works with verified drivers and transparent upfront fares — rated 4.9 by customers.\n\n👉 Read reviews: ${QUICK_LINKS.testimonials}`
    };
  }

  if (pick(text, ["thank", "thanks", "ok", "okay", "great"])) {
    return {
      reply: `Happy to help, ${firstName}! Anything else about cabs, routes, or bookings?`,
      suggestions: ["Book a cab", "Another route", "Talk to support"]
    };
  }

  if (pick(text, ["book", "booking", "reserve", "cab", "taxi", "ride"])) {
    return {
      reply: `You can book instantly on Cabzii — choose pickup, drop, date & vehicle type. Upfront fares with OTP-secure confirmation.\n\n👉 Start here: ${QUICK_LINKS.cabs}`,
      suggestions: ["Chennai to Bangalore", "Airport pickup", "Acting driver"]
    };
  }

  if (lastAssistantText(history).includes("route") && text.length > 3) {
    return {
      reply: `Got it — for "${text}", head to Cabzii search, enter pickup & drop, and you'll see live vehicle options with upfront fares.\n\n👉 ${QUICK_LINKS.cabs}`,
      suggestions: ["Airport taxi", "Talk to support"]
    };
  }

  return {
    reply: `I'm here to help with Cabzii bookings — cabs, airport transfers, outstation trips, acting drivers & tours. Try asking about a route, fare, or how to book.\n\nOr start booking: ${QUICK_LINKS.cabs}`,
    suggestions: ["Book a cab", "Airport taxi", "Outstation fare", "24/7 support"]
  };
}
